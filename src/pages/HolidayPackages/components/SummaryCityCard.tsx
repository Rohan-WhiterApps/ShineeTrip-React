import { Plane, Check } from "lucide-react";

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
      plan: string; 
      date?: string;
    }>;
    transportInfo?: {
      type: string;
      from: string;
      to: string;
      time: string;
    }; 
  };
}

export const SummaryCityCard = ({ cityData }: SummaryCityCardProps) => {
  const { transportInfo } = cityData;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      
      {/* 1. Top Transport Info Bar: Ab dynamic data dikhayega */}
      {transportInfo && (
        <div className="bg-[#F8F9FB] px-6 py-3 border-b border-gray-50">
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
            <Plane size={14} className="text-[#C9A961]" />
            <span>
              Arrival in <span className="font-bold text-[#2C4A5E]">{cityData.cityName}</span> from {transportInfo.from} | 
              Scheduled at <span className="font-bold">{transportInfo.time}</span>
            </span>
          </div>
        </div>
      )}

      {/* 2. City Header */}
      <div className="bg-gradient-to-r from-[#FDF6E9] to-white px-6 py-4">
        <h3 className="font-extrabold text-[#2C4A5E] text-lg">
          {cityData.cityName} - <span className="font-medium text-gray-500">{cityData.nights} Nights Stay</span>
        </h3>
      </div>

      {/* 3. Day Wise Table */}
      <div className="p-0">
        {cityData.days.map((day, idx) => (
          <div key={day.id || idx} className="grid grid-cols-12 border-b border-gray-50 last:border-0">
            
            {/* Day Label */}
            <div className="col-span-3 md:col-span-2 border-r border-gray-50 p-4 flex flex-col justify-center items-center bg-[#FAFAFA]/50">
              <p className="font-bold text-gray-800 text-sm">Day {day.dayNumber}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                {day.date || "Scheduled"}
              </p>
            </div>

            {/* Content Column */}
            <div className="col-span-9 md:col-span-10 flex flex-col md:flex-row md:items-center justify-between p-4 bg-white gap-4">
              
              {/* Plan Text - Ab dynamic hai */}
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1 bg-green-50 rounded-full p-0.5">
                  <Check size={10} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-700 leading-snug">
                    <span className="font-bold text-[#2C4A5E]">Plan:</span> {day.plan}
                  </p>
                </div>
              </div>

              {/* Badges - Counts from Swagger data */}
              <div className="flex flex-wrap gap-1.5 items-center md:justify-end">
                {day.flightsAndTransfers > 0 && (
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase border border-blue-100">
                    {day.flightsAndTransfers} Transport
                  </span>
                )}
                {day.hotels > 0 && (
                  <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-bold uppercase border border-green-100">
                    Hotel Included
                  </span>
                )}
                {day.activities > 0 && (
                  <span className="text-[9px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase border border-orange-100">
                    {day.activities} Activities
                  </span>
                )}
                {day.meals > 0 && (
                  <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase border border-red-100">
                    {day.meals} Meal
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