interface PricingSidebarProps {
  priceData: any;
  calculatedSummary: any;
  defaultOption?: 'withFlight' | 'withoutFlight';
}

export const PricingSidebar = ({ priceData, calculatedSummary, defaultOption = 'withFlight' }: PricingSidebarProps) => {
  
  // 1. Agar priceData abhi fetch ho raha hai, toh loading state dikhao
  if (!priceData) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-40 h-fit text-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-3/4 bg-gray-100 rounded"></div>
          <div className="h-12 w-full bg-gray-200 rounded-2xl"></div>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Syncing Price Details...</p>
        </div>
      </div>
    );
  }

  // 2. Logic: Pehle Summary API ka grandTotal check karenge, nahi toh fallback to priceData
  // Isse 404 error ke waqt bhi pricing sahi dikhegi
  const baseFare = calculatedSummary?.baseFarePerAdult || priceData?.base_fare || 0;
  const flightPrice = priceData?.flight_price || 0;
  const tax = calculatedSummary?.tax || priceData?.tax || 0;
  
  // Final Display Price logic based on user selection from Modal
  const displayPrice = defaultOption === 'withFlight' 
    ? (calculatedSummary?.grandTotal || priceData?.total_price_per_adult || (baseFare + flightPrice + tax))
    : baseFare;

  const formatPrice = (val: any) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return (num || 0).toLocaleString('en-IN');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-40 h-fit">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-[10px] font-bold text-[#C9A961] uppercase tracking-widest">
          {defaultOption === 'withFlight' ? "With Flight Package" : "Land Only Package"}
        </span>
        {calculatedSummary && (
          <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-1 rounded-md uppercase">
            Live Price
          </span>
        )}
      </div>

      <button className="w-full bg-[#C9A961] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#b39552] shadow-lg shadow-yellow-100 transition-all mb-6 uppercase tracking-wide active:scale-95">
        PAY & Book Now
      </button>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Base Fare</span>
          <span className="text-gray-900 font-bold">₹{formatPrice(baseFare)}</span>
        </div>
        
        {defaultOption === 'withFlight' && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Flight & Logistics</span>
            <span className="text-gray-900 font-bold">₹{formatPrice(flightPrice)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Taxes & Fees</span>
          <span className="text-gray-900 font-bold">₹{formatPrice(tax)}</span>
        </div>

        {calculatedSummary?.discount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-600">
            <span className="font-medium">Special Discount</span>
            <span className="font-bold">- ₹{formatPrice(calculatedSummary.discount)}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">Total Amount</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">*Inclusive of all taxes</span>
        </div>
        <span className="text-2xl font-extrabold text-[#2C4A5E]">
          ₹{formatPrice(displayPrice)}
        </span>
      </div>
    </div>
  );
};