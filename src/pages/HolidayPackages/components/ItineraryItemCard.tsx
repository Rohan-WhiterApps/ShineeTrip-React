import { Plane, Hotel, MapPin, Coffee, Car } from "lucide-react";

export const ItineraryItemCard = ({ item }: any) => {
  // Swagger schema mein metadata object ke andar saari detail hai
  const meta = item.metadata || {};

  // 1. FLIGHT CARD RENDER
  if (item.type === 'flight') {
    return (
      <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-100 flex items-center justify-between mb-4 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Plane size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Flight Included</p>
            <h4 className="font-bold text-gray-800">
              {meta.from || "Origin"} to {meta.to || "Destination"}
            </h4>
            <p className="text-[10px] text-blue-500 font-bold uppercase mt-0.5">
              {meta.airline_name || "Confirmed Airline"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-md uppercase">
            {meta.class || "Economy"}
          </span>
        </div>
      </div>
    );
  }

  // 2. HOTEL CARD RENDER
  if (item.type === 'hotel') {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 mb-4 hover:shadow-md transition-shadow animate-in fade-in duration-300">
        <img 
          src={item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} 
          className="w-24 h-24 rounded-xl object-cover border border-gray-50" 
          alt="hotel"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                {meta.room_type || "Standard Room"}
              </p>
              <h4 className="font-bold text-gray-800 text-lg leading-tight">
                {meta.hotel_name || "Premium Stay"}
              </h4>
            </div>
            <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md border border-green-100">
              {meta.meal_plan || "EP (Room Only)"}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3">
             <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
                <Coffee size={14} className="text-[#C9A961]" /> 
                {meta.inclusions?.includes("Breakfast") ? "Breakfast Included" : "Meals as per plan"}
             </div>
             <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium">
                <MapPin size={14} className="text-[#C9A961]" /> 
                {meta.city || "Destination"}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. TRANSFER / CAR CARD RENDER (Optional but good for UX)
  if (item.type === 'transfer' || item.type === 'car') {
    return (
      <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-gray-100 flex items-center justify-between mb-4 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <Car size={24} className="text-[#AB7E29]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transfer</p>
            <h4 className="font-bold text-gray-800">{meta.transfer_type || "Private Transfer"}</h4>
            <p className="text-[10px] text-gray-500 font-medium">{meta.route || "Point to Point"}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirmed</span>
      </div>
    );
  }

  return null;
};