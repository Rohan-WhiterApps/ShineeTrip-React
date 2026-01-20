import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";

/* ---------------- API INTERFACE ---------------- */
interface ApiPackage {
  id: number;
  title: string;
  shortDescription: number;
  description: string;
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  nights: string;
  pricePerPerson: string;
  totalPrice: string;
  emiAmount: string;
  property: {
    name: string;
    city: string;
    country: string;
    rating: string;
  };
  includedServices: string[];
}

/* ---------------- UI INTERFACE ---------------- */
interface Package {
  id: number;
  title: string;
  badge: string;
  image: string;

  features: string[]; // ← includedServices
  amenities: string[]; // ← highlights

  location: string;

  pricing: {
    emiStartsAt: number;
    totalPrice: number;
    pricePerPerson: number;
  };
}

/* ---------------- TRANSFORM FUNCTION ---------------- */
const transformApiPackage = (api: ApiPackage): Package => {
  return {
    id: api.id,
    title: api.title,
    badge: api.nights + "N" || "4N",
    image: api.heroImage || "hello ji no image",

    features: api.includedServices || [],
    amenities: api.highlights || [],

    location: api.property
      ? `${api.property.city}, ${api.property.country}`
      : "Unknown",

    pricing: {
      emiStartsAt: Number(api.emiAmount || 0),
      totalPrice: Number(api.totalPrice),
      pricePerPerson: Number(api.pricePerPerson),
    },
  };
};

/* ---------------- CARD COMPONENT ---------------- */
const PackageCard: React.FC<{ pkg: Package }> = ({ pkg }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <img
        src={pkg.image}
        alt={pkg.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">
        {/* Title + Badge */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex-1">
            {pkg.title}
          </h3>
          <div className="ml-4 border-2 border-blue-600 text-blue-600 px-4 py-1 rounded-lg text-base font-bold">
            {pkg.badge}
          </div>
        </div>

        {/* Included Services */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-6">
          {pkg.features.map((service, i) => (
            <div key={i} className="flex items-center gap-2.5 text-gray-600">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <span className="text-base">{service}</span>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="text-base font-semibold text-gray-900 mb-6">
          {pkg.location}
        </div>

        {/* Amenities (highlights) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {pkg.amenities.map((amenity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg"
            >
              <Briefcase className="w-5 h-5 text-gray-700" />
              <span className="text-base font-medium text-teal-600">
                {amenity}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between pt-4">
          <div>
            <div className="text-base text-gray-600 mb-1">No Cost EMI at</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹ {pkg.pricing.emiStartsAt.toLocaleString()}/month
            </div>
          </div>

          <div className="text-right">
            <div className="text-base text-gray-600 mb-2">
              Total Price ₹ {pkg.pricing.totalPrice.toLocaleString()}
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold px-8 py-3 rounded-xl transition-colors">
              ₹{pkg.pricing.pricePerPerson.toLocaleString()}/person
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */
const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("shineetrip_token");

        const res = await fetch("http://46.62.160.188:3000/holiday-packages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("API:", data.items);

        if (data?.items) {
          const mapped = data.items.map((pkg: ApiPackage) =>
            transformApiPackage(pkg)
          );
          setPackages(mapped);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen mt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white py-4 px-6 border-b">
        <h1 className="text-2xl font-bold">All Packages</h1>
        <p className="text-sm text-gray-500">Experience Beach & Sunsets</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading…</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            No packages available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
