import { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../../Login/Loginpage";

export const HolidaySearchWidget = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // --- AUTOCOMPLETE STATES ---
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 1. FETCH CITIES FROM HOLIDAY-PACKAGE API
  useEffect(() => {
    const fetchPackageCities = async () => {
      try {
        const token = sessionStorage.getItem("shineetrip_token");
        const res = await fetch("http://46.62.160.188:3000/holiday-package?limit=100", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const result = await res.json();
        const packages = result.data || result;

        if (Array.isArray(packages)) {
          const allCities = packages.flatMap((pkg: any) => pkg.included_cities || []);
          const uniqueCities: string[] = Array.from(new Set(allCities)).sort() as string[];
          setAvailableCities(uniqueCities);
        }
      } catch (error) {
        console.error("Failed to fetch cities from packages:", error);
      }
    };
    fetchPackageCities();
  }, []);

  // 2. Real-time Filter (Hero Design Style)
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

  // 3. Close on Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const token = sessionStorage.getItem("shineetrip_token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    const params: any = { page: "1", limit: "10" };
    if (location.trim()) params.city = location.trim();
    if (departureDate) params.departureDate = departureDate;

    const query = new URLSearchParams(params).toString();
    navigate(`/holiday-packages?${query}`);
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4 relative z-20">
        <div className="grid p-3 grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* TO - DESTINATION (Included Cities Search) */}
          <div className="space-y-2 relative" ref={wrapperRef}>
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase">
              <MapPin size={14} className="text-[#D2A256]" /> TO
            </label>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#D2A256]/50 transition-all relative">
              <input 
                type="text" 
                value={location}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search Goa, Manali..." 
                className="w-full bg-transparent text-white text-xl font-bold focus:outline-none placeholder:text-white/30"
              />
              <p className="text-[10px] text-white/40 mt-1 uppercase">Search by included cities</p>
              
              {/* SUGGESTIONS (Hero Section Design) */}
              {showSuggestions && filteredCities.length > 0 && (
                <div className="absolute left-0 right-0 z-[100] mt-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-2xl bg-[#1E1E1E]/95 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 text-[9px] font-bold text-[#EFD08D] uppercase tracking-widest border-b border-white/5 bg-white/5">
                    Suggested Package Cities
                  </div>
                  <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                    {filteredCities.map((city, index) => (
                      <li 
                        key={index}
                        onClick={() => {
                          setLocation(city);
                          setShowSuggestions(false);
                        }}
                        className="group flex items-center gap-4 px-4 py-3 hover:bg-white/5 cursor-pointer transition-all border-b border-white/5 last:border-0"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#AB7E29] group-hover:to-[#EFD08D] transition-all">
                          <MapPin size={18} className="text-[#D2A256] group-hover:text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-[#EFD08D]">{city}</span>
                          <span className="text-[10px] text-gray-400 uppercase">Available in Packages</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* DEPARTURE DATE */}
          <div className="p-2 space-y-2">
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase">
              <Calendar size={14} className="text-[#D2A256]" /> DEPARTURE DATE
            </label>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#D2A256]/50 transition-all">
              <input 
                type="date" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full h-10 bg-transparent text-white text-xl font-bold focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* ROOMS & GUEST (Keep as UI) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase">
              <Users size={14} className="text-[#D2A256]" /> ROOMS & GUEST
            </label>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#D2A256]/50 transition-all flex justify-between items-center cursor-pointer">
              <div>
                <span className="text-white text-xl font-bold uppercase">All</span>
                <p className="text-[10px] text-white/40 mt-1 uppercase">All Classes</p>
              </div>
              <ChevronDown size={18} className="text-[#D2A256]" />
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <button 
              onClick={handleSearch}
              className="flex items-center gap-3 px-12 py-4 rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{ background: 'linear-gradient(180.95deg, #AB7E29 0.87%, #EFD08D 217.04%)' }}
            >
              <Search size={20} /> SEARCH
            </button>
          </div>
        </div>
      </div>
      <LoginModal isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </>
  );
};