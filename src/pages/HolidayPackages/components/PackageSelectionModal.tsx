import { X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
// Note: useSearchParams hata diya hai kyunki ab hum Props use karenge

interface PackageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; 
  persons: number;
  // ✅ CHANGE 1: Ye do naye props add karo
  currentCity?: string;
  currentDate?: string;
}

// ✅ CHANGE 2: Props yaha receive (destructure) karo
export const PackageSelectionModal = ({ 
  isOpen, 
  onClose, 
  data, 
  persons, 
  currentCity, 
  currentDate 
}: PackageSelectionModalProps) => {
  
  const navigate = useNavigate();
  // Note: searchParams hook ki ab zarurat nahi hai

  if (!isOpen) return null;

  // Navigation Logic
  const handleNavigation = (selectionType: 'flight' | 'land') => {
    onClose(); 
    
    // ✅ CHANGE 3: URL banana (Ab seedha props use kar rahe hain)
    let targetUrl = `/package-detail/${data.id}?persons=${persons}`;
    
    // Agar prop me city aayi hai to add karo
    if (currentCity) {
      targetUrl += `&city=${currentCity}`;
    }
    // Agar prop me date aayi hai to add karo
    if (currentDate) {
      targetUrl += `&departureDate=${currentDate}`;
    }

    // Navigate karo
    navigate(targetUrl, { 
      state: { type: selectionType } 
    });
  };

  // Price formatting helper
  const formatPrice = (val: any) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return (num || 0).toLocaleString('en-IN');
  };

  // API fields mapping
  const withFlightPrice = data?.price?.total_price_per_adult ?? 0;
  const withoutFlightPrice = data?.price?.base_fare ?? 0;
  
  // Discount logic check
  const discountPercent = data?.price?.discount ?? 10;
  const originalWithFlight = Math.round(withFlightPrice / (1 - discountPercent / 100));
  const originalWithoutFlight = Math.round(withoutFlightPrice / (1 - discountPercent / 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[450px] rounded-t-[24px] md:rounded-[24px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header - Light Sky Blue Background */}
        <div className="flex justify-between items-center px-6 py-5 bg-[#5271c79c] border-b border-blue-100">
          <h3 className="font-bold text-gray-900 text-lg truncate pr-4 leading-tight">{data.title}</h3>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-50 rounded-full transition-colors shrink-0 shadow-sm">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 bg-white">
          
          {/* Card 1: With Flight (Light Blue Theme) */}
          <div 
            onClick={() => handleNavigation('flight')}
            className="group relative bg-[#F5FAFF] border border-[#CDE5F7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
          >
            {/* Left Content */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] text-gray-500 font-medium tracking-wide">Starting from . New Delhi</p>
              <h4 className="font-extrabold text-gray-900 text-lg">With Flight</h4>
            </div>

            {/* Right Content */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-gray-400 line-through decoration-gray-400 mb-0.5">₹{formatPrice(originalWithFlight)}</p>
                <div className="flex flex-col items-end leading-none">
                  <span className="font-bold text-gray-900 text-lg">₹ {formatPrice(withFlightPrice)}</span>
                  <span className="text-[10px] font-medium text-gray-500 mt-0.5">/person</span>
                </div>
              </div>
              {/* Green Arrow */}
              <ChevronRight className="text-[#219653] stroke-[3px]" size={22} />
            </div>
          </div>

          {/* Card 2: Without Flight (Beige/Gold Theme) */}
          <div 
            onClick={() => handleNavigation('land')}
            className="group relative bg-[#FFF9F0] border border-[#E8DCC2] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
          >
            {/* Left Content */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] text-gray-500 font-medium tracking-wide">Starting from . New Delhi</p>
              <h4 className="font-extrabold text-gray-900 text-lg">Without Flight</h4>
            </div>

            {/* Right Content */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-gray-400 line-through decoration-gray-400 mb-0.5">₹{formatPrice(originalWithoutFlight)}</p>
                <div className="flex flex-col items-end leading-none">
                  <span className="font-bold text-gray-900 text-lg">₹ {formatPrice(withoutFlightPrice)}</span>
                  <span className="text-[10px] font-medium text-gray-500 mt-0.5">/person</span>
                </div>
              </div>
              {/* Green Arrow */}
              <ChevronRight className="text-[#219653] stroke-[3px]" size={22} />
            </div>
          </div>

          {/* EMI Indicator */}
          {data?.price?.emi_per_month > 0 && (
            <p className="text-[11px] text-gray-400 text-center font-medium pt-3">
              * Low cost EMI available starting from <span className="text-gray-700 font-bold border-b border-gray-300">₹{formatPrice(data.price.emi_per_month)}/month</span>
            </p>
          )}

        </div>
      </div>
    </div>
  );
};