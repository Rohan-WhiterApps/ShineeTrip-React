import { useState } from "react";
import { MapPin, Calendar, Users, Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../../Login/Loginpage";

export const HolidaySearchWidget = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleSearch = () => {
    // 1. Token Check (Authentication)
    const token = sessionStorage.getItem("shineetrip_token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    // 2. Validation
    if (!location.trim()) {
      alert("Please enter a destination city");
      return;
    }

  
    const query = new URLSearchParams({
      city: location.trim(),
      departureDate: departureDate || new Date().toISOString().split("T")[0],
      page: "1",
      limit: "10"
    }).toString();

    // 4. Navigation to Results Page
    navigate(`/holiday-packages?${query}`);
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4 relative z-20">
        <div className="grid p-3 grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* FROM - Optional for Packages */}
          {/* <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase">
              <MapPin size={14} className="text-[#D2A256]" /> FROM
            </label>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#D2A256]/50 transition-all">
              <input 
                type="text" 
                placeholder="New Delhi" 
                className="w-full bg-transparent text-white text-xl font-bold focus:outline-none placeholder:text-white/30"
              />
              <p className="text-[10px] text-white/40 mt-1 uppercase">NDLS, Railway Station</p>
            </div>
          </div> */}

          {/* TO - Destination (City Search Parameter) */}
          <div className="space-y-2 relative">
            <label className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase">
              <MapPin size={14} className="text-[#D2A256]" /> TO
            </label>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#D2A256]/50 transition-all">
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search City" 
                className="w-full bg-transparent text-white text-xl font-bold focus:outline-none placeholder:text-white/30"
              />
              <p className="text-[10px] text-white/40 mt-1 uppercase">Enter City Name</p>
            </div>
          </div>

          {/* DEPARTURE DATE (ISO 8601 Parameter) */}
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

          {/* ROOMS & GUEST */}
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

          {/* Floating Search Button */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <button 
              onClick={handleSearch}
              className="flex items-center gap-3 px-12 py-4 rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{
                background: 'linear-gradient(180.95deg, #AB7E29 0.87%, #EFD08D 217.04%)',
              }}
            >
              <Search size={20} />
              SEARCH
            </button>
          </div>
        </div>
      </div>
      <LoginModal isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </>
  );
};