import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface HolidaySearchProps {
  isDetailsPage?: boolean;
}

export const HolidaySearch = ({ isDetailsPage = false }: HolidaySearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States ko URL params se sync kar rahe hain
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [date, setDate] = useState(searchParams.get("departureDate") || "");

  // Jab URL badle (Hero section se search ho), tab inputs update ho jayein
  useEffect(() => {
    setCity(searchParams.get("city") || "");
    setDate(searchParams.get("departureDate") || "");
  }, [searchParams]);

  const handleListingSearch = () => {
    if (!city.trim()) {
      alert("Please enter a destination");
      return;
    }
    // URL params update honge, jisse HolidayPackages.tsx ka useEffect trigger hoga
    setSearchParams({
      city: city.trim(),
      departureDate: date || new Date().toISOString().split("T")[0],
      page: "1",
      limit: "10"
    });
  };

  return (
    <div className={`w-full transition-all duration-300 ${
      isDetailsPage 
        ? "bg-white py-4" 
        : "-mt-10 relative z-20"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Original Grey Pill Container */}
        <div className="bg-[#e9e9e9] rounded-full shadow-xl flex items-center p-1 border border-gray-100">
          
          {/* City/Property Section */}
          <div className="flex-1 flex items-center gap-3 px-6 border-r border-gray-300">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MapPin size={18} className="text-[#C9A961]" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">City, Area or Property</span>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where to?" 
                className="text-sm font-bold text-gray-800 focus:outline-none bg-transparent w-full"
              />
            </div>
          </div>

          {/* Check-In/Departure Section */}
          <div className="flex-1 flex items-center gap-3 px-6 border-r border-gray-300 hidden md:flex">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar size={18} className="text-[#C9A961]" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Departure Date</span>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm font-bold text-gray-800 focus:outline-none bg-transparent w-full [color-scheme:light]"
              />
            </div>
          </div>

          {/* Room & Guests Section (Static as per original) */}
          <div className="flex-1 flex items-center gap-3 px-6 hidden lg:flex">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users size={18} className="text-[#C9A961]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Room & Guest</span>
              <span className="text-sm font-bold text-gray-800 whitespace-nowrap uppercase">1 Room, 2 Adult</span>
            </div>
          </div>

          {/* Original Black Circle Search Button */}
          <div className="p-1">
            <button 
              onClick={handleListingSearch}
              className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center active:scale-95"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};