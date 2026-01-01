import { ImageIcon } from "lucide-react";

interface PackageGalleryProps {
  heroImage: string;
  title: string;
  onOpenGallery: () => void;
  // API se aane wala categories array yahan pass karenge
  imageCategories: any[]; 
}

export const PackageGallery = ({ heroImage, title, onOpenGallery, imageCategories }: PackageGalleryProps) => {
  
  // Swagger data se categories nikal rahe hain
  // Hum pehli 2 categories uthayenge center aur right slot ke liye
  const activitiesCat = imageCategories?.find(cat => 
    cat.title.toLowerCase().includes('activities') || cat.title.toLowerCase().includes('sightseeing')
  ) || imageCategories?.[0];

  const propertyCat = imageCategories?.find(cat => 
    cat.title.toLowerCase().includes('property') || cat.title.toLowerCase().includes('hotel')
  ) || imageCategories?.[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[450px] md:h-[500px]">
        
        {/* 1. Main Hero Image - Left Side (From hero_image field) */}
        <div className="md:col-span-4 relative rounded-3xl overflow-hidden group">
          <img 
            src={heroImage} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <button 
            onClick={onOpenGallery}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#C9A961] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:bg-[#b39552] transition-colors flex items-center gap-2 whitespace-nowrap z-10"
          >
            <ImageIcon size={18} /> View Gallery
          </button>
        </div>

        {/* 2. Center Image - Dynamic from imageCategories */}
        <div 
          onClick={onOpenGallery} 
          className="md:col-span-4 relative rounded-3xl overflow-hidden cursor-pointer group"
        >
          <img 
            src={activitiesCat?.images?.[0]?.image_url || "https://images.unsplash.com/photo-1590050751117-2c819df9e94e"} 
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
            alt="Activities"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <span className="text-white font-bold text-lg">{activitiesCat?.title || "Activities & Sightseeing"}</span>
            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
              {activitiesCat?.images?.length || 0} Photos
            </p>
          </div>
        </div>

        {/* 3. Right Image - Dynamic from imageCategories */}
        <div 
          onClick={onOpenGallery}
          className="md:col-span-4 relative rounded-3xl overflow-hidden cursor-pointer group"
        >
          <img 
            src={propertyCat?.images?.[0]?.image_url || "https://images.unsplash.com/photo-1566665797739-1674de7a421a"} 
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
            alt="Property"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            <span className="text-white font-bold text-lg">{propertyCat?.title || "Property Photos"}</span>
            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
              {propertyCat?.images?.length || 0} Photos
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};