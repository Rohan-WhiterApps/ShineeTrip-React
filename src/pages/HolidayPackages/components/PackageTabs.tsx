export const PackageTabs = ({ activeTab, setActiveTab }: any) => {
  const tabs = [
    { id: 'itineraries', label: 'Itineraries', icon: '🗺️' },
    { id: 'policies', label: 'Policies', icon: '📜' },
    { id: 'summary', label: 'Summary', icon: '📋' }
  ];

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 font-bold text-sm transition-all border-b-2 ${
              activeTab === tab.id ? "border-[#C9A961] text-[#C9A961]" : "border-transparent text-gray-500"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};