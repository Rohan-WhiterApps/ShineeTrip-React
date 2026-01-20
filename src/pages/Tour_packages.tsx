import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, Calendar, Users } from 'lucide-react';

const Tourspackages = () => {
  const [selectedSort, setSelectedSort] = useState('Most Popular');

  const sortOptions = [
    'Most Popular',
    'Price- Low to high',
    'Price- High to low',
    'Best Rated',
    'Lowest Price & Best Rated',
  ];

  const packages = Array(8).fill({
    title: 'Romantic Beachfront Goa Retreat',
    rating: '4N/5D',
    features: [
      '4 Start Hotel',
      '2 Activities',
      'Honeymoon Hamper',
      'North Goa Sightseeing'
    ],
    additionalFeatures: [
      'Airport Pickup & Drop',
      'Selected Meals'
    ],
    emiPrice: '1,903',
    totalPrice: '9,953',
    fullPrice: '19,506',
    image: '/api/placeholder/350/250'
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-[116px] font-opensans">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[116px] z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Search Fields */}
          <div className="flex items-center justify-center gap-0">
            {/* Location Field */}
            <div className="flex-1 max-w-[250px] bg-gray-100 px-6 py-2 border-r border-gray-300">
              <div className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                CITY, AREA OR PROPERTY
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D2A256]" />
                <span className="text-base font-normal text-gray-900">Goa</span>
              </div>
            </div>

            {/* Check-in Field */}
            <div className="flex-1 max-w-[200px] bg-gray-100 px-6 py-2 border-r border-gray-300">
              <div className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                CHECK-IN
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D2A256]" />
                <span className="text-base font-normal text-gray-900">
                  Fri, 21 Nov 2025
                </span>
              </div>
            </div>

            {/* Check-out Field */}
            <div className="flex-1 max-w-[200px] bg-gray-100 px-6 py-2 border-r border-gray-300">
              <div className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                CHECK-OUT
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D2A256]" />
                <span className="text-base font-normal text-gray-900">
                  Fri, 21 Nov 2025
                </span>
              </div>
            </div>

            {/* Room & Guest Field */}
            <div className="flex-1 max-w-[200px] bg-gray-100 px-6 py-2">
              <div className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                ROOM & GUEST
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D2A256]" />
                <span className="text-base font-normal text-gray-900">
                  1 Room, 2 Adult
                </span>
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-colors ml-4">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Goa Packages</h1>
          <p className="text-gray-600 text-lg">Experience Beach & Sunsets</p>
        </div>

        {/* Horizontal Scroll Buttons */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button className="p-2 bg-white rounded-full shadow border">
              <ChevronLeft size={20} />
            </button>
            {sortOptions.map((option, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  idx === 0
                    ? 'bg-gray-800 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
            <button className="p-2 bg-white rounded-full shadow border">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"
                  alt="Goa Beach"
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{pkg.title}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    {pkg.rating}
                  </span>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                  <div>
                    {pkg.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        <span className="text-gray-400 text-xs mt-1">•</span>
                        <span className={`text-sm ${feature.includes('Honeymoon') || feature.includes('North') ? 'text-green-600' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {pkg.additionalFeatures.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        <span className="text-gray-400 text-xs mt-1">•</span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">No Cost EMI at</p>
                    <p className="text-2xl font-bold text-gray-900">₹ {pkg.emiPrice}/month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-semibold">₹ {pkg.totalPrice}/person</p>
                    <p className="text-xs text-gray-500">Total Price ₹ {pkg.fullPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tourspackages;