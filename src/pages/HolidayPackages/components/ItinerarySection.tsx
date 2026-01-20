import { Plane, Car, Hotel, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

interface ItinerarySectionProps {
  days: any[];
  holiday: any;
  summary: any; // Dedicated Summary API data
}

export const ItinerarySection = ({ days, holiday, summary }: ItinerarySectionProps) => {
  // Default pehla din open rakhenge
  const [openDay, setOpenDay] = useState(days[0]?.dayNumber || 1);

  // Summary API se total counts nikal rahe hain chips ke liye
  const stats = summary?.days?.reduce((acc: any, curr: any) => ({
    hotels: acc.hotels + (curr.hotels || 0),
    flights: acc.flights + (curr.flightsAndTransfers || 0),
    activities: acc.activities + (curr.activities || 0),
    meals: acc.meals + (curr.meals || 0),
  }), { flights: 0, hotels: 0, activities: 0, meals: 0 }) || null;

  const getValidImage = (imgUrl: string) => {

  if (!imgUrl || imgUrl === "data:;base64,=" || imgUrl.trim() === "") {
    return "https://images.unsplash.com/photo-1512100356956-c1227c331701?q=80&w=1000"; // Fallback Image
  }
  return imgUrl;
};

  return (
    <div className="w-full font-opensans">
      {/* 1. Top Summary Chips (Real counts from Summary API) */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider">
          {holiday?.days || summary?.totalDays || 0} DAY PLAN
        </span>
        {stats && (
          <>
            <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
              {stats.flights} FLIGHTS & TRANSFERS
            </span>
            <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
              {stats.hotels} HOTELS
            </span>
            <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
              {stats.activities} ACTIVITIES
            </span>
            <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
              {stats.meals} MEALS
            </span>
          </>
        )}
      </div>

      <div className="flex gap-8">
        {/* Left Side: Day Plan Sticky Navigation */}
        <div className="hidden bg-gray-200 p-5 rounded-2xl md:block w-32 shrink-0 h-fit sticky top-40">
          <p className="font-bold text-[13px] mb-4 text-[#2C4A5E]">DAY PLAN</p>
          <div className="space-y-6 relative border-l-2 border-gray-100 ml-2">
            {days.map((day: any) => (
              <div 
                key={day.id} 
                onClick={() => setOpenDay(day.dayNumber)}
                className="relative pl-6 cursor-pointer group"
              >
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-colors ${openDay === day.dayNumber ? 'bg-[#C9A961] border-[#C9A961]' : 'bg-white border-gray-300'}`} />
                <p className={`text-[11px] font-bold ${openDay === day.dayNumber ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                   Day {day.dayNumber}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Expandable Itinerary Content */}
        <div className="flex-grow space-y-4">
          {days.map((day: any) => {
            const daySummary = summary?.days?.find((d: any) => d.dayNumber === day.dayNumber);
            
            return (
              <div key={day.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                <div 
                  onClick={() => setOpenDay(openDay === day.dayNumber ? 0 : day.dayNumber)}
                  className="bg-[#9c9e9f] text-white px-5 py-3 flex justify-between items-center cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-white/20 px-3 py-1 rounded text-[11px] font-bold uppercase">DAY {day.dayNumber}</span>
                    <p className="text-sm font-medium">
                      {day.title} • 
                      <span className="text-gray-300 uppercase text-[10px] ml-2">
                        Included: {daySummary?.hotels ? '1 Hotel | ' : ''}{daySummary?.flightsAndTransfers ? 'Transport | ' : ''}{daySummary?.activities ? `${daySummary.activities} Activities` : ''}
                      </span>
                    </p>
                  </div>
                  <ChevronDown size={20} className={`transition-transform ${openDay === day.dayNumber ? 'rotate-180' : ''}`} />
                </div>

                {openDay === day.dayNumber && (
                  <div className="p-6 space-y-10 animate-in fade-in slide-in-from-top-2">
                    
                    {day.items?.map((item: any) => {
                      const meta = item.metadata || {};

                      // 1. FLIGHT SECTION
                      if (item.type === 'flight') {
                        return (
                          <div key={item.id} className="flex gap-6">
                            <Plane size={20} className="text-gray-800 mt-1" />
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-4">
                                <p className="font-bold text-sm uppercase">Flight</p>
                                <span className="text-gray-400 text-xs">• {meta.departureCity} to {meta.arrivalCity} • {meta.durationText || 'N/A'}</span>
                              </div>
                              <div className="bg-[#F9F9F9] rounded-xl p-6 flex items-center justify-between border border-gray-50">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border shadow-sm p-1 overflow-hidden">
                                     {meta.airline_logo ? (
                                       <img src={meta.airline_logo} alt="Airline" className="w-8" />
                                     ) : (
                                       <Plane size={16} className="text-gray-300" />
                                     )}
                                   </div>
                                   <div className="text-center">
                                      <p className="font-bold text-xl">{meta.departureTime || '--:--'}</p>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase">{meta.departureCity || 'City'}</p>
                                   </div>
                                   <div className="flex flex-col items-center px-4">
                                      <span className="text-[10px] text-gray-400 italic">Non-stop</span>
                                      <div className="w-24 h-[1px] bg-gray-300 relative border-t border-dashed">
                                          <div className="absolute top-1/2 -right-1 w-1 h-1 bg-gray-400 rounded-full" />
                                      </div>
                                   </div>
                                   <div className="text-center">
                                      <p className="font-bold text-xl">{meta.arrivalTime || '--:--'}</p>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase">{meta.arrivalCity || 'City'}</p>
                                   </div>
                                </div>
                                <div className="text-[11px] font-medium text-gray-600 space-y-1">
                                  <p>Cabin: {meta.cabinBaggage || '7Kgs'}</p>
                                  <p>Check-in: {meta.checkInBaggage || '15Kgs'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }


                      // 2. HOTEL SECTION
                      if (item.type === 'hotel') {
                        return (
                          <div key={item.id} className="flex gap-6 border-t pt-8 border-gray-100">
                            <Hotel size={20} className="text-gray-800 mt-1" />
                            <div className="flex-grow">
                              <p className="font-bold text-sm uppercase mb-4">
                                Hotel <span className="text-gray-400 font-normal text-xs">• Stay in {meta.location || 'Dest'} • {meta.nights || '0'} Night</span>
                              </p>
                              <div className="flex flex-col lg:flex-row gap-6">
                                {/* Image Logic Fixed */}
                                {item.image || meta.hotel_image ? (
                                  <img 
                                    src={getValidImage(item.image || meta.hotel_image)} 
                                    className="w-full lg:w-64 h-40 object-cover rounded-2xl" 
                                    alt="Hotel" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full lg:w-64 h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs text-center px-4">
                                    No Hotel Image Provided
                                  </div>
                                )}
                      
                                <div className="flex-grow">
                                  <h4 className="font-bold text-xl text-gray-800">{meta.name || meta.hotel_name || 'Property Name'}</h4>
                                  <div className="flex items-center gap-1 my-1">
                                    {Array.from({ length: meta.starRating || 0 }).map((_, s) => (
                                      <span key={s} className="text-green-500 text-xs">★</span>
                                    ))}
                                    <span className="text-xs text-gray-400 ml-2">Verified Property</span>
                                  </div>
                                  <p className="font-bold text-[#2EB159] text-sm mt-3">{meta.roomType || 'Standard Room'}</p>
                                  
                                  {/* List Logic Fixed */}
                                  <ul className="mt-2 space-y-1">
                                    {meta.mealInclusions ? (
                                      meta.mealInclusions.map((inc: string, i: number) => (
                                        <li key={i} className="text-[11px] text-gray-600 flex items-center gap-2">✔ {inc}</li>
                                      ))
                                    ) : meta.highlights ? (
                                      meta.highlights.map((h: any, i: number) => (
                                        <li key={i} className="text-[11px] text-gray-600 flex items-center gap-2">✔ {h}</li>
                                      ))
                                    ) : (
                                      <li className="text-[11px] text-gray-400 italic">Confirmed as per booking</li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      // 3. SIGHTSEEING SECTION (Adding this for Day 2 & 3)
                      if (item.type === 'sightseeing') {
                        return (
                          <div key={item.id} className="flex gap-6 border-t pt-8 border-gray-100">
                            <MapPin size={20} className="text-red-500 mt-1" />
                            <div className="flex-grow">
                              <p className="font-bold text-sm uppercase mb-4">Sightseeing <span className="text-gray-400 font-normal text-xs">• {meta.location} • {meta.durationText || 'Full Day'}</span></p>
                              <div className="flex flex-col lg:flex-row gap-6">
                                {item.image ? (
                                  <img 
                                    src={getValidImage(item.image)} 
                                    className="w-full lg:w-64 h-40 object-cover rounded-2xl" 
                                    alt="Sightseeing" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full lg:w-64 h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs">Sightseeing Image</div>
                                )}
                                <div className="flex-grow">
                                  <h4 className="font-bold text-xl text-gray-800">{meta.title}</h4>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {meta.highlights?.map((h: string, i: number) => (
                                      <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold border border-red-100 uppercase">✓ {h}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 4. TRANSFER/CAR SECTION
                      if (item.type === 'transfer' || item.type === 'car') {
                        return (
                          <div key={item.id} className="flex gap-6 border-t pt-8 border-gray-100">
                            <Car size={20} className="text-gray-800 mt-1" />
                            <div className="flex-grow">
                              <p className="font-bold text-sm uppercase mb-4">Transfer <span className="text-gray-400 font-normal text-xs">• {meta.subtitle || 'Route'} • {meta.durationText || 'N/A'}</span></p>
                              <div className="flex gap-5 items-center">
                                {item.image ? (
                                  <img 
                                    src={getValidImage(item.image)} 
                                    className="w-48 h-28 object-cover rounded-xl" 
                                    alt="Transfer" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600";
                                    }}
                                  />
                                ) : (
                                  <div className="w-48 h-28 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs text-center px-4">Vehicle Visuals Not Provided</div>
                                )}
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800">{meta.name || 'Private Transfer'}</h4>
                                  <p className="text-xs text-gray-500 mt-1">{meta.transferType === 'private' ? 'Private AC Vehicle' : 'Shared Transport'}</p>
                                  <p className="text-xs text-gray-500 mt-1 italic font-medium">{meta.luggage || 'Standard Luggage'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}

                    {/* Fallback description */}
                    {(!day.items || day.items.length === 0) && (
                      <div className="pl-11">
                        <p className="text-sm text-gray-600 leading-relaxed italic">Leisure day at your own pace. All mentioned inclusions remain confirmed.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};