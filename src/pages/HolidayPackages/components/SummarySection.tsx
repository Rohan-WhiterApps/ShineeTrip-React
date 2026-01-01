import { SummaryCityCard } from "./SummaryCityCard";

interface SummarySectionProps {
  days: any[]; // Itinerary days array from /itineraries
  summary: any; // Dedicated Summary API response from /itinerary-summaries
}

export const SummarySection = ({ days, summary }: SummarySectionProps) => {
  
  // Logic: API ke summary days aur itinerary metadata ko combine karke City-wise grouping
  const getGroupedSummary = () => {
    if (!summary || !summary.days) return [];

    const groupedCities: any[] = [];

    summary.days.forEach((summaryDay: any) => {
      // Corresponding itinerary day dhund rahe hain city aur date info ke liye
      const itineraryDay = days.find(d => d.dayNumber === summaryDay.dayNumber);
      
      // Sabse pehle Hotel metadata se city check karenge, phir transfer/flight se
      const cityName = itineraryDay?.items?.find((i: any) => i.type === 'hotel')?.metadata?.city || 
                       itineraryDay?.items?.find((i: any) => i.type === 'flight')?.metadata?.to_city || 
                       itineraryDay?.items?.find((i: any) => i.type === 'transfer')?.metadata?.route?.split('to')[1]?.trim() ||
                       itineraryDay?.title?.split('in')[1]?.trim() ||
                       "Destination";

      let cityGroup = groupedCities.find(c => c.cityName === cityName);

      // Date formatting for the UI
      const formattedDate = itineraryDay?.startDate ? new Date(itineraryDay.startDate).toLocaleDateString('en-GB', { 
        day: 'numeric', month: 'short', weekday: 'short' 
      }) : `Day ${summaryDay.dayNumber}`;

      const dayData = {
        ...summaryDay,
        date: formattedDate
      };

      if (cityGroup) {
        cityGroup.days.push(dayData);
        // Jitne days us city mein hain, nights count (Days - 1) logic ya pure counts
        cityGroup.nights = cityGroup.days.length; 
      } else {
        groupedCities.push({
          cityName: cityName,
          nights: 1,
          days: [dayData],
          // Transport info agar us city mein entry flight hai
          transportInfo: itineraryDay?.items?.find((i: any) => i.type === 'flight')?.metadata || null
        });
      }
    });

    return groupedCities;
  };

  const cityWiseData = getGroupedSummary();

  // Summary counts nikalne ke liye
  const totalActivities = summary?.days?.reduce((sum: number, day: any) => sum + (day.activities || 0), 0);
  const totalMeals = summary?.days?.reduce((sum: number, day: any) => sum + (day.meals || 0), 0);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* 1. Top Filter Chips - Using Real API Stats */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
          {summary?.totalDays || days.length} DAY PLAN
        </span>
        <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
          {totalActivities || 0} ACTIVITIES INCLUDED
        </span>
        <span className="bg-[#F3F3F3] text-[#444] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
          {totalMeals || 0} MEALS PLANNED
        </span>
        {summary?.discount > 0 && (
          <span className="bg-[#F3F3F3] text-[#C9A961] px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase border border-[#C9A961]/20">
            {summary.discount}% OFF APPLIED
          </span>
        )}
      </div>

      {/* 2. Grouped Summary Cards */}
      {cityWiseData.length > 0 ? (
        cityWiseData.map((city, index) => (
          <SummaryCityCard key={index} cityData={city} />
        ))
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-[30px] border-2 border-dashed border-gray-100">
          <div className="animate-pulse bg-gray-100 h-12 w-12 rounded-full mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Itinerary Summary...</p>
        </div>
      )}

      {/* 3. Important Note - Design matching Figma */}
      <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-[25px] mt-6 flex items-start gap-4">
        <div className="bg-orange-100 p-2 rounded-full text-orange-600 text-xs">ℹ</div>
        <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
          <span className="font-bold block mb-1 uppercase tracking-tighter">Booking Information:</span> 
          Your final itinerary total is {summary?.grandTotal ? `₹${summary.grandTotal.toLocaleString()}` : 'calculated'} including all taxes, surcharges and listed activities. Changes to flight times may affect the daily sequence but all inclusions will remain confirmed.
        </p>
      </div>
    </div>
  );
};