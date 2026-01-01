import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "@/pages/LandingPage/Footer";
import { HolidaySearch } from "../components/HolidaySearch";
import { PackageCard } from "../components/PackageCard";
import { Navbar } from "@/pages/Navbar";

const HolidayPackages = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const city = searchParams.get("city") || "";
        const date = searchParams.get("departureDate") || "";
        
        
        const token = sessionStorage.getItem("shineetrip_token");

        const url = `http://46.62.160.188:3000/holiday-package?city=${city}&departureDate=${date}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            // 2. Token ko headers mein pass karna
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 403 || response.status === 401) {
          console.error("Auth Error: Token missing or expired");
          // Aap chahein toh yahan user ko login page par redirect kar sakte hain
          return;
        }

        const result = await response.json();
        
        if (result.data) {
          setPackages(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="h-64 bg-[#263238] flex items-center justify-center pt-20">
        <h1 className="text-white text-3xl font-bold font-opensans tracking-tight">
          Find Your Perfect Holiday
        </h1>
      </div>
      <HolidaySearch />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2C4A5E]">
            {searchParams.get("city") ? `${searchParams.get("city")} Packages` : "Available Packages"}
          </h2>
          <p className="text-gray-500">Curated experiences for your next trip</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A961]"></div>
            <p className="text-sm font-medium text-gray-400">Fetching packages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {packages.length > 0 ? (
              packages.map((pkg: any) => (
                <PackageCard key={pkg.id} data={pkg} />
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold text-lg">No packages found for this search.</p>
                <p className="text-sm text-gray-400">Try searching for a different city or date.</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HolidayPackages;