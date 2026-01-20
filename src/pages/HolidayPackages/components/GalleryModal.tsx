import { X, Camera } from "lucide-react";
import { useState, useEffect } from "react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageCategories: any[]; 
}

export const GalleryModal = ({ isOpen, onClose, title, imageCategories }: GalleryModalProps) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeCity, setActiveCity] = useState("All");

  const validCategories = imageCategories?.filter(cat => cat.images && cat.images.length > 0) || [];

  // Reset index when modal opens to ensure we don't point to an empty category
  useEffect(() => {
    if (isOpen && activeCategoryIndex >= validCategories.length) {
      setActiveCategoryIndex(0);
    }
  }, [isOpen, validCategories.length]);

  if (!isOpen) return null;

  // Current selected category data
  const currentCategory = validCategories[activeCategoryIndex] || { images: [], title: "Gallery" };
  
  // Dynamic City Tabs
  const cities = ["All", ...Array.from(new Set(currentCategory.images?.map((img: any) => img.city).filter(Boolean) as string[]))];


  const filteredImages = activeCity === "All" 
    ? currentCategory.images || []
    : (currentCategory.images || []).filter((img: any) => img.city === activeCity);

  return (
    <div className="fixed inset-0 mt-24 z-[999] bg-white overflow-y-auto font-opensans animate-in fade-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Sticky Header Section */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-50 py-4 border-b border-gray-100">
          <div className="max-w-[80%]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[#C9A961] text-[10px] font-black uppercase tracking-[0.2em]">Official Visual Gallery</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all active:scale-90 shadow-sm"
          >
            <X size={28} className="text-gray-800" />
          </button>
        </div>

        {/* 1. Category Selection Chips */}
        <div className="flex flex-wrap gap-4 mb-10">
          {validCategories.map((cat, idx) => (
            <div 
              key={cat.id || idx}
              onClick={() => { setActiveCategoryIndex(idx); setActiveCity("All"); }}
              className={`flex items-center gap-4 border p-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeCategoryIndex === idx 
                ? "bg-white border-[#C9A961] shadow-xl ring-1 ring-[#C9A961]/20 scale-105" 
                : "bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200"
              }`}
            >
              <img 
                src={cat.images?.[0]?.image_url || "https://images.unsplash.com/photo-1593693397690-362af9666fc2"} 
                className="w-12 h-12 rounded-xl object-cover shadow-sm" 
                alt={cat.title} 
              />
              <div className="flex flex-col pr-3">
                <span className="text-[10px] font-black text-gray-800 leading-none mb-1 uppercase">{cat.title}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{cat.images?.length || 0} Photos</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. City Tabs (Dynamic) */}
        {cities.length > 1 && (
          <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar border-b border-gray-50">
            {cities.map((city: string) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCity === city 
                  ? "bg-black text-white shadow-lg scale-105" 
                  : "bg-gray-100 text-gray-400 border border-transparent hover:bg-gray-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {/* 3. Section Title */}
        <div className="mb-10 flex items-center gap-4">
          <Camera size={20} className="text-[#C9A961]" />
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
            {currentCategory.title} <span className="text-gray-300 ml-2 font-light">/ {activeCity}</span>
          </h3>
        </div>

        {/* 4. Responsive Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((img: any, i: number) => (
            <div key={img.id || i} className="aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl group relative bg-gray-50 border border-gray-100">
              <img 
                src={img.image_url}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                alt={img.caption || "Gallery item"}
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-xs font-bold leading-tight">
                    {img.caption || `${currentCategory.title}`}
                  </p>
                  <span className="text-[#C9A961] text-[9px] font-black uppercase tracking-[0.2em] mt-2 block">
                    {img.city || "Official View"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {validCategories.length === 0 && (
          <div className="text-center py-40 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
            <Camera size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Visual assets are being synced from server...</p>
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};