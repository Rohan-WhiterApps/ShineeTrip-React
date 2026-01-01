import { Plane, Car, Check } from "lucide-react";

// Naye schema ke according props interface
interface SummaryCityCardProps {
  cityData: {
    cityName: string;
    nights: number;
    days: Array<{
      id: string;
      dayNumber: number;
      flightsAndTransfers: number;
      hotels: number;
      activities: number;
      meals: number;
      dayCost: number;
      summary: string; // API se aane wali main summary line
      date?: string;
    }>;
    transportInfo?: any; // Hero section ya flight details ke liye
  };
}

export const SummaryCityCard = ({ cityData }: SummaryCityCardProps) => {
  const { transportInfo } = cityData;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      
      {/* 1. Top Transport Info Bar: Sirf tab dikhega jab API mein transport details honge */}
      {transportInfo && (
        <div className="bg-[#F8F9FB] px-6 py-3 flex flex-col gap-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
            <Plane size={14} className="text-gray-400" />
            <span>
              Arrival in {cityData.cityName} by {transportInfo.airline_name || "Flight"} | 
              Departing {transportInfo.departure_time || "TBA"} | 
              Arriving {transportInfo.arrival_time || "TBA"}
            </span>
          </div>
        </div>
      )}

      {/* 2. City Header (Exact Design Kept) */}
      <div className="bg-gradient-to-r from-[#FDF6E9] to-white px-6 py-4">
        <h3 className="font-extrabold text-[#2C4A5E] text-lg">
          {cityData.cityName} - <span className="font-medium">{cityData.nights} Nights Stay</span>
        </h3>
      </div>

      {/* 3. Summary Table Structure (Mapped from Itinerary Summary API) */}
      <div className="p-0">
        {cityData.days.map((day, idx) => (
          <div key={day.id || idx} className="grid grid-cols-12 border-b border-gray-50 last:border-0">
            
            {/* Day Label (Design As-Is) */}
            <div className="col-span-2 border-r border-gray-50 p-4 flex flex-col justify-center items-center bg-[#FAFAFA]/50">
              <p className="font-bold text-gray-800 text-sm">Day {day.dayNumber}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                {day.date || "Scheduled"}
              </p>
            </div>

            {/* Services Columns: API ki 'summary' string ko main text banaya hai */}
            <div className="col-span-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4 bg-white">
              
              {/* Main Summary Plan */}
              <div className="flex items-start gap-3 py-2">
                <div className="mt-1 bg-gray-100 rounded-full p-0.5">
                  <Check size={10} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-700 leading-tight">
                    <span className="font-bold">Plan:</span> {day.summary || "Independent activities and leisure time."}
                  </p>
                </div>
              </div>

              {/* Counts Badges from API */}
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0 items-center justify-end">
                {day.flightsAndTransfers > 0 && (
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">
                    {day.flightsAndTransfers} Transport
                  </span>
                )}
                {day.hotels > 0 && (
                  <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-bold uppercase">
                    Hotel Included
                  </span>
                )}
                {day.activities > 0 && (
                  <span className="text-[9px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase">
                    {day.activities} Activities
                  </span>
                )}
                {day.meals > 0 && (
                  <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase">
                    {day.meals} Meals
                  </span>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};