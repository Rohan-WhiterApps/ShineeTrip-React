import React from 'react';
import { Check, MapPin, Calendar, Users, Mail, Phone, Home, Download, Plane, Hotel } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SuccessCardProps {
    orderData: any; // Swagger GET /holiday-package-orders ka single object
}

const HolidayBookingSuccessCard: React.FC<SuccessCardProps> = ({ orderData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    

    const selectionType = location.state?.type || 'flight';

    if (!orderData) return null;

    const pkg = orderData.holidayPackage;
    const customer = orderData.customer;

    // Date formatting helper
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "TBA";
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-[300] bg-gray-50/90 backdrop-blur-md overflow-y-auto pt-10 pb-10 flex justify-center">
            <div className="w-full max-w-2xl bg-transparent animate-in fade-in zoom-in duration-500">
                
                {/* 1. Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D1FAE5] rounded-full mb-4 shadow-sm">
                        <Check className="text-[#10B981]" size={32} strokeWidth={3} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Your trip to {pkg?.included_cities?.[0] || 'your destination'} has been successfully booked
                    </p>
                </div>

                {/* 2. Main Detail Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6 relative overflow-hidden">
                    
                    {/* Booking ID Header */}
                    <div className="text-center mb-8">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                             Booking ID
                        </p>
                        <h2 className="text-lg font-bold text-gray-800">{orderData.receipt || `SHN-${orderData.id}-2026`}</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Info Rows */}
                        <div className="flex gap-4">
                            <MapPin className="text-gray-400 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Destination</p>
                                <p className="text-sm text-gray-500">{pkg?.included_cities?.join(", ") || "Package Location"}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Calendar className="text-gray-400 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Travel Dates</p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(orderData.startDate)} - {formatDate(orderData.endDate)} ({pkg?.nights || 0} Nights)
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pb-6 border-b border-gray-100">
                            <Users className="text-gray-400 shrink-0" size={20} />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Guests</p>
                                <p className="text-sm text-gray-500">{orderData.adults || 2} Adults, {orderData.children || 0} Children</p>
                            </div>
                        </div>


                        {selectionType === 'flight' && (
                            <div className="bg-[#F9FAFB] rounded-xl p-4 flex items-center gap-4 animate-in slide-in-from-left-2">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                                    <Plane className="text-orange-500" size={20} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-bold text-gray-800">Confirmed Flight Included</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-tight">
                                        {pkg?.included_cities?.[0] || 'Origin'} Arrival • {formatDate(orderData.startDate)}
                                    </p>
                                </div>
                            </div>
                        )}


                        <div className="bg-[#F9FAFB] rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                                <Hotel className="text-blue-500" size={20} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-bold text-gray-800">{pkg?.title || "Luxury Stay"}</p>
                                <p className="text-xs text-gray-500">
                                    Stay in {pkg?.included_cities?.[0] || "Destination"} • Premium Inclusions
                                </p>
                            </div>
                        </div>

                        {/* Contact Info Footer */}
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-sm font-bold text-gray-800 mb-3">Confirmation sent to:</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Mail size={16} /> {customer?.email || "guest@email.com"}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Phone size={16} /> {customer?.phone || "+91 98765 43210"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 px-2 mt-8 no-print">
                    <button 
                        onClick={() => window.print()}
                        className="flex-1 bg-[#10B981] text-white py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#059669] transition-all shadow-md active:scale-95"
                    >
                        <Download size={18} /> Download Invoice / PDF
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="flex-1 bg-white text-gray-700 py-3.5 rounded-lg font-bold text-sm border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <Home size={18} /> Back to Home
                    </button>
                </div>

                <style>{`
                  @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .fixed { position: relative !important; }
                  }
                `}</style>
            </div>
        </div>
    );
};

export default HolidayBookingSuccessCard;