import { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../../Login/Loginpage";

export const HolidaySearchWidget = () => {
  const navigate = useNavigate();
  
  // Search States
  const [location, setLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [roomType, setRoomType] = useState(""); 
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Data States
  const [allPackages, setAllPackages] = useState<any[]>([]); 
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  
  // Room Type Logic States
  const [availableRoomTypes, setAvailableRoomTypes] = useState<string[]>([]); 
  
  // UI States
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  // Refs
  const cityWrapperRef = useRef<HTMLDivElement>(null);
  const roomWrapperRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // 1. FETCH & EXTRACT DATA (Smart Extraction)
  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const token = sessionStorage.getItem("shineetrip_token");
        const res = await fetch("http://46.62.160.188:3000/holiday-package?limit=100", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const result = await res.json();
        const packages = result.data || result;

        if (Array.isArray(packages)) {
          setAllPackages(packages);

          // --- SMART CITY EXTRACTION ---
          const extractedCities = new Set<string>();

          packages.forEach((pkg: any) => {
            // A. Check included_cities
            if (Array.isArray(pkg.included_cities)) {
              pkg.included_cities.forEach((c: string) => extractedCities.add(c));
            }

            // B. Check Itinerary Hotel Locations (Jodhpur wahi chhupa hai)
            if (pkg.itinerary?.days) {
              pkg.itinerary.days.forEach((day: any) => {
                day.items?.forEach((item: any) => {
                  if (item.type === 'hotel' && item.metadata?.location) {
                    // Extract city from location string (e.g. "Mumbai, India" -> "Mumbai")
                    const city = item.metadata.location.split(',')[0].trim();
                    extractedCities.add(city);
                  }
                });
              });
            }
          });

          // Sort and Set
          setAvailableCities(Array.from(extractedCities).sort());
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };
    fetchPackageData();
  }, []);

  // 2. FILTER CITIES
  useEffect(() => {
    if (location.trim()) {
      const userInput = location.toLowerCase().trim();
      const filtered = availableCities.filter(city => 
        city.toLowerCase().includes(userInput)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [location, availableCities]);

  // 3. DYNAMIC ROOM TYPE LOGIC (Fixed for Jodhpur)
  useEffect(() => {
    // Helper function to extract rooms from a package
    const extractRoomsFromPackage = (pkg: any) => {
      const rooms: string[] = [];
      if (pkg.itinerary?.days) {
        pkg.itinerary.days.forEach((day: any) => {
          day.items?.forEach((item: any) => {
            // Sirf Hotel items se roomType nikalo
            if (item.type === 'hotel' && item.metadata?.roomType) {
              rooms.push(item.metadata.roomType);
            }
          });
        });
      }
      return rooms;
    };

    if (location.trim()) {
      const userInput = location.toLowerCase();

      // Find packages matching the selected location (Title, Included Cities, or Itinerary Location)
      const matchingPackages = allPackages.filter(pkg => {
        const inIncluded = pkg.included_cities?.some((c: string) => c.toLowerCase().includes(userInput));
        const inTitle = pkg.title?.toLowerCase().includes(userInput);
        
        // Deep check inside itinerary for hotel locations
        const inItinerary = pkg.itinerary?.days?.some((day: any) => 
          day.items?.some((item: any) => 
            item.type === 'hotel' && item.metadata?.location?.toLowerCase().includes(userInput)
          )
        );

        return inIncluded || inTitle || inItinerary;
      });

      // Extract rooms from matched packages
      const rawRooms = matchingPackages.flatMap(extractRoomsFromPackage);
      const uniqueRooms = Array.from(new Set(rawRooms)).sort();
      setAvailableRoomTypes(uniqueRooms);

    } else {
      // Show ALL room types if no location selected
      const allRooms = allPackages.flatMap(extractRoomsFromPackage);
      setAvailableRoomTypes(Array.from(new Set(allRooms)).sort());
    }
  }, [location, allPackages]);

  // 4. SEARCH HANDLER
  const handleSearch = () => {
    const token = sessionStorage.getItem("shineetrip_token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    const params: any = { page: "1", limit: "10" };
    if (location.trim()) params.city = location.trim();
    if (departureDate) params.departureDate = departureDate;
    if (roomType && roomType !== "All Classes") params.roomType = roomType;

    const query = new URLSearchParams(params).toString();
    navigate(`/holiday-packages?${query}`);
  };

  // Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityWrapperRef.current && !cityWrapperRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
      if (roomWrapperRef.current && !roomWrapperRef.current.contains(event.target as Node)) {
        setShowRoomDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative bg-white/5 backdrop-blur-sm p-3 rounded-[2rem] border border-white/10">
          
          {/* --- 1. DESTINATION INPUT --- */}
          <div 
            ref={cityWrapperRef}
            onClick={() => locationInputRef.current?.focus()}
            className="group bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-[#D2A256]/50 transition-all relative cursor-text h-28 flex flex-col justify-center"
          >
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase mb-2">
              <MapPin size={14} className="text-[#D2A256]" /> TO
            </label>
            <input 
              ref={locationInputRef}
              type="text" 
              value={location}
              onFocus={() => setShowCitySuggestions(true)}
              onChange={(e) => {
                setLocation(e.target.value);
                setRoomType(""); // Reset room when city changes
              }}
              placeholder="Search Destination..." 
              className="w-full bg-transparent text-white text-xl font-bold focus:outline-none placeholder:text-white/30"
            />
            <p className="text-[10px] text-white/40 mt-1 uppercase truncate">
              {location ? "Location Selected" : "Search by city"}
            </p>
            
            {showCitySuggestions && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-[100] mt-2 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-2xl bg-[#1E1E1E] overflow-hidden">
                <div className="px-4 py-2 text-[9px] font-bold text-[#EFD08D] uppercase tracking-widest border-b border-white/5 bg-white/5">
                  Suggested Cities
                </div>
                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredCities.map((city, index) => (
                    <li 
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(city);
                        setShowCitySuggestions(false);
                      }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer transition-all border-b border-white/5 last:border-0"
                    >
                      <MapPin size={16} className="text-[#D2A256]" />
                      <span className="text-sm font-bold text-white">{city}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* --- 2. DEPARTURE DATE --- */}
          <div 
            onClick={() => dateInputRef.current?.showPicker()}
            className="group bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-[#D2A256]/50 transition-all relative cursor-pointer h-28 flex flex-col justify-center"
          >
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase mb-2">
              <Calendar size={14} className="text-[#D2A256]" /> DEPARTURE DATE
            </label>
            <input 
              ref={dateInputRef}
              type="date" 
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-transparent text-white text-xl font-bold focus:outline-none [color-scheme:dark] cursor-pointer"
            />
            <p className="text-[10px] text-white/40 mt-1 uppercase">
              Select Travel Date
            </p>
          </div>

          {/* --- 3. ROOM TYPE (DYNAMIC) --- */}
          <div 
            ref={roomWrapperRef}
            onClick={() => setShowRoomDropdown(!showRoomDropdown)}
            className="group bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-[#D2A256]/50 transition-all relative cursor-pointer h-28 flex flex-col justify-center"
          >
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase mb-2">
              <Users size={14} className="text-[#D2A256]" /> ROOM TYPE
            </label>
            
            <div className="flex justify-between items-center">
              <span className={`text-xl font-bold uppercase ${roomType ? "text-white" : "text-white/50"}`}>
                {roomType || "All Classes"}
              </span>
              <ChevronDown size={18} className={`text-[#D2A256] transition-transform ${showRoomDropdown ? "rotate-180" : ""}`} />
            </div>
            
            <p className="text-[10px] text-white/40 mt-1 uppercase truncate">
              {availableRoomTypes.length} Classes Available
            </p>

            {showRoomDropdown && (
              <div className="absolute top-full left-0 right-0 z-[100] mt-2 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-2xl bg-[#1E1E1E] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                 <div className="px-4 py-2 text-[9px] font-bold text-[#EFD08D] uppercase tracking-widest border-b border-white/5 bg-white/5">
                  Select Class
                </div>
                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                  <li 
                    onClick={() => setRoomType("")}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white text-sm font-bold border-b border-white/5"
                  >
                    All Classes
                  </li>

                  {availableRoomTypes.length > 0 ? (
                    availableRoomTypes.map((type, index) => (
                      <li 
                        key={index}
                        onClick={() => setRoomType(type)}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white text-sm font-bold border-b border-white/5 last:border-0 flex justify-between items-center"
                      >
                        {type}
                        {roomType === type && <div className="w-2 h-2 rounded-full bg-[#D2A256]" />}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-6 text-center text-white/40 text-xs">
                      No specific classes found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <div className="absolute -bottom-18 left-1/2 -translate-x-1/2 z-30">
            <button 
              onClick={handleSearch}
              className="flex items-center gap-3 px-10 py-3.5 rounded-full text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[#D2A256]/40 border border-[#EFD08D]/30"
              style={{ background: 'linear-gradient(180deg, #AB7E29 0%, #D2A256 100%)' }}
            >
              <Search size={18} /> 
              <span className="tracking-wider">SEARCH PACKAGES</span>
            </button>
          </div>

        </div>
      </div>
      <LoginModal isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </>
  );
};