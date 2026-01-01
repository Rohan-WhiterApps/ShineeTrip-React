import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; 
import { PackageGallery } from "../components/PackageGallery";
import { PricingSidebar } from "../components/PricingSidebar";
import { PackageTabs } from "../components/PackageTabs";
import { HolidaySearch } from "../components/HolidaySearch";
import { ItinerarySection } from "../components/ItinerarySection";
import { SummarySection } from "../components/SummarySection"; 
import { GalleryModal } from "../components/GalleryModal";

const PackageDetailsPage = () => {
  const { id } = useParams(); 
  const [activeTab, setActiveTab] = useState('itineraries');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const [itineraryData, setItineraryData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const userPreference = location.state?.selectedOption || 'withFlight';

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // URL wali ID (e.g., 15)

      setLoading(true);
      try {
        const token = sessionStorage.getItem("shineetrip_token");
        const headers = { 
          'accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        };

        // 1. Kadi Pehli: Holiday Package ID se Itinerary dhoondo
        const resPkg = await fetch(`http://46.62.160.188:3000/itineraries?holidayPackageId=${id}`, { headers });
        const pkgJson = await resPkg.json();
        console.log("Full API Response:", pkgJson);
        
        if (Array.isArray(pkgJson) && pkgJson.length > 0) {
          const mainItinerary = pkgJson[0]; 
          setItineraryData(mainItinerary);
          console.log("Fetched Itinerary Data:", mainItinerary.id);

          // 2. Kadi Dusri: ASALI ID milne ke baad hi Summary call karein
          // Hum mainItinerary.id (UUID) bhej rahe hain
          if (mainItinerary.id) {
            try {
              const resSum = await fetch(`http://46.62.160.188:3000/itinerary-summaries/by-itinerary/${mainItinerary.id}`, { headers });
              
              if (resSum.ok) {
                const sumJson = await resSum.json();
                setSummaryData(sumJson);
              } else {
                console.warn("Summary table mein is ID ki entry nahi mili:", mainItinerary.id);
                setSummaryData(null);
              }
            } catch (sumError) {
              console.error("Summary API network error:", sumError);
            }
          }
        }
      } catch (error) {
        console.error("Itinerary Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A961]"></div>
      <p className="text-[#5A5550] font-bold tracking-widest uppercase text-xs">Loading Luxury Experience...</p>
    </div>
  );

  if (!itineraryData) return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-bold text-gray-400 text-center p-6">
      Package details currently unavailable.<br/>Please check if the Itinerary is created in Swagger.
    </div>
  );

  const holiday = itineraryData.holidayPackage;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-opensans animate-in fade-in duration-700">
      <div className="pt-30"> 
        <HolidaySearch isDetailsPage={true} />
      </div>

      <PackageGallery 
        heroImage={holiday?.hero_image}
        title={holiday?.title}
        onOpenGallery={() => setIsGalleryOpen(true)} 
        imageCategories={holiday?.imageCategories || []} 
      />

      <GalleryModal 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        title={holiday?.title} 
        imageCategories={holiday?.imageCategories || []}
      />
      
      <PackageTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8">
            {activeTab === 'itineraries' && (
              <ItinerarySection 
                days={itineraryData.days || []} 
                holiday={holiday}
                summary={summaryData} 
              />
            )}
            
            {activeTab === 'summary' && (
              <SummarySection 
                days={itineraryData.days || []}
                summary={summaryData} 
              />
            )}
            
            {activeTab === 'policies' && (
              <div className="p-8 bg-white rounded-[30px] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#2C4A5E] mb-6 border-b pb-4">Policies & Cancellation</h3>
                <p className="text-sm text-gray-500 leading-relaxed italic whitespace-pre-wrap bg-gray-50 p-6 rounded-2xl border border-dashed">
                  {holiday?.policies || "Standard policies apply."}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <PricingSidebar 
               priceData={holiday?.price} 
               calculatedSummary={summaryData}
               defaultOption={userPreference} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;