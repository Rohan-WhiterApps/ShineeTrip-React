import { Plane, ScrollText, ClipboardList } from "lucide-react";

export const PackageTabs = ({ activeTab, setActiveTab }: any) => {
  const tabs = [
    { id: 'itineraries', label: 'Itineraries', Icon: Plane }, // Plane for Itinerary (Travel)
    { id: 'policies', label: 'Policies', Icon: ScrollText },  // ScrollText for Policies (Rules/Docs)
    { id: 'summary', label: 'Summary', Icon: ClipboardList }  // ClipboardList for Summary (Overview)
  ];

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm font-opensans">
      <div className="max-w-7xl mx-auto px-4 flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 font-bold text-[18px] font-opensans transition-all border-b-2 ${
              activeTab === tab.id ? "border-[#C9A961] text-[#C9A961]" : "border-transparent text-gray-500"
            }`}
          >
            {/* Icon render */}
            <tab.Icon size={20} strokeWidth={2} /> 
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  
);
};