import { X } from "lucide-react";
import { useState } from "react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageCategories: any[]; // Swagger API se aane wala data
}

export const GalleryModal = ({ isOpen, onClose, title, imageCategories }: GalleryModalProps) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeCity, setActiveCity] = useState("All");

  if (!isOpen) return null;

  // 1. Current selected category data
  const currentCategory = imageCategories?.[activeCategoryIndex] || { images: [], title: "Gallery" };
  
  // 2. Dynamic City Tabs based on images in the current category
  const cities = ["All", ...Array.from(new Set(currentCategory.images?.map((img: any) => img.city).filter(Boolean) as string[]))];

  // 3. Filtering logic
  const filteredImages = activeCity === "All" 
    ? currentCategory.images || []
    : (currentCategory.images || []).filter((img: any) => img.city === activeCity);

  return (
    <div className="fixed inset-0 z-[200] bg-white overflow-y-auto font-opensans animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="max-w-[80%]">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">{title}</h2>
            <p className="text-[#C9A961] text-xs font-bold uppercase mt-2 tracking-widest">Official Gallery</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-90 sticky top-0 bg-white shadow-sm md:shadow-none">
            <X size={32} className="text-gray-800" />
          </button>
        </div>

        {/* 1. Category Chips (Top Sidebar Style) */}
        <div className="flex flex-wrap gap-4 mb-10">
          {imageCategories?.map((cat, idx) => (
            <div 
              key={cat.id || idx}
              onClick={() => { setActiveCategoryIndex(idx); setActiveCity("All"); }}
              className={`flex items-center gap-4 border p-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeCategoryIndex === idx 
                ? "bg-white border-[#C9A961] shadow-lg ring-1 ring-[#C9A961]/20 scale-105" 
                : "bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200"
              }`}
            >
              <img 
                src={cat.images?.[0]?.image_url || "https://images.unsplash.com/photo-1593693397690-362af9666fc2"} 
                className="w-14 h-14 rounded-xl object-cover shadow-sm" 
                alt={cat.title} 
              />
              <div className="flex flex-col pr-3">
                <span className="text-[11px] font-bold text-gray-800 leading-none mb-1">{cat.title || "Category"}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{cat.images?.length || 0} Photos</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. City Filter Tabs (Dynamic) */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar border-b border-gray-50">
          {cities.map((city: string) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCity === city 
                ? "bg-black text-white shadow-2xl scale-110" 
                : "bg-gray-100 text-gray-400 border border-transparent hover:bg-gray-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* 3. Section Title */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-[2px] w-12 bg-[#C9A961]"></div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
            {currentCategory.title} <span className="text-gray-300 ml-2 font-light">/ {activeCity}</span>
          </h3>
        </div>

        {/* 4. The Responsive Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredImages.map((img: any, i: number) => (
            <div key={img.id || i} className="aspect-[4/3] rounded-[45px] overflow-hidden shadow-xl group relative bg-gray-100">
              <img 
                src={img.image_url}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                alt={img.caption || "Gallery item"}
                loading="lazy"
              />
              
              {/* Overlay with Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm font-bold leading-tight drop-shadow-md">
                    {img.caption || `${currentCategory.title} - ${img.city || ""}`}
                  </p>
                  <span className="text-[#C9A961] text-[10px] font-black uppercase tracking-widest mt-2 block">
                    {img.city || "Explore"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Logic */}
        {filteredImages.length === 0 && (
          <div className="text-center py-32 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No visuals found for this selection.</p>
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-24"></div>
      </div>
    </div>
  );
};