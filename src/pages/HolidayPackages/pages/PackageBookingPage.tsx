import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, Award, Shield, Clock, Loader2, X, CheckCircle2, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import HolidayBookingSuccessCard from '../components/HolidayBookingSuccessCard';


declare global {
    interface Window {
        Razorpay: any;
    }
}

const PackageBookingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // 1. Data from URL and State
    const packageId = searchParams.get('packageId');
    const totalAmount = parseFloat(searchParams.get('amount') || '0');
    const selectionType = location.state?.type || 'flight';
    const adults = parseInt(searchParams.get('adults') || '2');
    const children = parseInt(searchParams.get('children') || '0');

    const [packageDetails, setPackageDetails] = useState<any>(null);

    // 2. Form & UI States
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        firstName: '',
        lastName: '',
        agreePolicy: false
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
    const [successOrderId, setSuccessOrderId] = useState('');
    const [completeOrderData, setCompleteOrderData] = useState<any>(null);

    const RAZORPAY_KEY = 'rzp_test_Ri1Lg8tbqZnUaT';
    const API_BASE = 'http://46.62.160.188:3000/holiday-package-orders';

    // ASALI DATA FETCH
    useEffect(() => {
        const fetchPkg = async () => {
            try {
                const token = sessionStorage.getItem("shineetrip_token");
                const res = await fetch(`http://46.62.160.188:3000/holiday-package?page=1&limit=50`, {
                    headers: { 
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                });
                const result = await res.json();
                const allPackages = result.data || result;
                if (Array.isArray(allPackages)) {
                    const currentPkg = allPackages.find((p: any) => p.id === parseInt(packageId || '0'));
                    if (currentPkg) setPackageDetails(currentPkg);
                }
            } catch (error) {
                console.error("Fatal Fetch Error:", error);
            }
        };
        if (packageId) fetchPkg();
    }, [packageId]);

    // --- NEW VALIDATION LOGIC ---
    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setErrorMessage("First and Last name are required.");
            return false;
        }
        if (!emailRegex.test(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return false;
        }
        if (formData.phone.length !== 10) {
            setErrorMessage("Phone number must be exactly 10 digits.");
            return false;
        }
        if (!formData.agreePolicy) {
            setErrorMessage("Please agree to the booking terms.");
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Validation check
        if(!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const token = sessionStorage.getItem('shineetrip_token');
        const customerId = sessionStorage.getItem('shineetrip_db_customer_id');

        if (!token || !customerId) {
            setErrorMessage('Session expired. Please log in again.');
            return;
        }

        setIsProcessing(true);
        try {
            const orderPayload = {
                holidayPackageId: parseInt(packageId || '0'),
                adults: adults,
                children: children,
                totalPrice: totalAmount,
                paymentMethod: "online",
                currency: "INR",
                customerId: parseInt(customerId)
            };
            console.log("Order Payload:", orderPayload.totalPrice);

            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const orderData = await response.json();
            if (!response.ok) throw new Error(orderData.message || 'Order creation failed');
            console.log("UI Price:", totalAmount);
console.log("Price sent to Razorpay (in Paise):", totalAmount * 100);
console.log("Razorpay Order ID from Backend:", orderData.razorpayOrderId);

            const options = {
                key: RAZORPAY_KEY,
                amount: totalAmount * 100,
                currency: "INR",
                name: "Shinee Trip",
                description: `Package Booking: ${packageDetails?.title || packageId}`,
                order_id: orderData.razorpayOrderId,
                handler: async (res: any) => { await verifyPayment(res, orderData.razorpayOrderId); },
                prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
                theme: { color: "#AB7E29" },
                modal: { ondismiss: () => setIsProcessing(false) }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        }
        
    };

    const verifyPayment = async (rzpRes: any, orderId: string) => {
    const token = sessionStorage.getItem('shineetrip_token');
    try {
        const verifyRes = await fetch(`${API_BASE}/success`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                razorpayOrderId: orderId,
                razorpayPaymentId: rzpRes.razorpay_payment_id,
                razorpaySignature: rzpRes.razorpay_signature
            }),
        });

        if (verifyRes.ok) {

            const res = await fetch(`http://46.62.160.188:3000/holiday-package-orders?limit=1`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            

            const latestOrder = result.data ? result.data[0] : result[0];

            setCompleteOrderData(latestOrder); 
            setIsBookingSuccessful(true);
        } else {
            throw new Error('Verification failed');
        }
    } catch (err: any) {
        setErrorMessage("Payment successful but failed to load summary. Check 'My Bookings'.");
        setIsBookingSuccessful(true); 
    } finally {
        setIsProcessing(false);
    }
};

if (isBookingSuccessful && completeOrderData) {
    return <HolidayBookingSuccessCard orderData={completeOrderData} />;
}

    return (
        <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20 font-opensans">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* 🛑 GLOBAL ERROR ALERT DESIGN */}
                {errorMessage && (
                    <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-700 text-sm font-bold uppercase tracking-tight">{errorMessage}</p>
                        <button onClick={() => setErrorMessage('')} className="ml-auto text-red-400 hover:text-red-600">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-all">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-[#2C4A5E] uppercase tracking-tight">Review Your Booking</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Secure Checkout</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 1. Package Info Card (Existing Design) */}
                        {packageDetails ? (
                            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                                    <img 
                                        src={packageDetails.hero_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
                                        className="w-full h-full object-cover" 
                                        alt="Package" 
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-[#AB7E29]/10 text-[#AB7E29] text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">Verified Package</span>
                                        <span className="text-gray-300 text-[10px]">•</span>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase">
                                            {packageDetails.nights || "0"}N / {packageDetails.days || "0"}D
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-extrabold text-[#2C4A5E] mb-2">{packageDetails.title}</h2>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {Array.isArray(packageDetails.inclusions) && packageDetails.inclusions.slice(0, 4).map((inc: string, i: number) => (
                                            <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                                <CheckCircle2 size={12} className="text-green-500" /> {inc}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 bg-white rounded-[32px] border border-gray-100 flex items-center justify-center animate-pulse">
                                <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">Loading Package Preview...</p>
                            </div>
                        )}

                        {/* 2. Traveler Information Form (Design Matched + Valdiations Added) */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                                    <Mail className="text-white" size={20} />
                                </div>
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Traveler Details</h3>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">First Name</label>
                                        <input 
                                            type="text" required placeholder="John"
                                            value={formData.firstName}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#D2A256] outline-none transition-all font-bold text-gray-700"
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Last Name</label>
                                        <input 
                                            type="text" required placeholder="Doe"
                                            value={formData.lastName}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#D2A256] outline-none transition-all font-bold text-gray-700"
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Address</label>
                                        <input 
                                            type="email" required placeholder="john@example.com"
                                            value={formData.email}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#D2A256] outline-none transition-all font-bold text-gray-700"
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Phone Number (10 Digits)</label>
                                        <input 
                                            type="tel" required placeholder="9876543210"
                                            value={formData.phone}
                                            maxLength={10}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#D2A256] outline-none transition-all font-bold text-gray-700"
                                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                    <input 
                                        type="checkbox" required className="mt-1 w-4 h-4 accent-[#AB7E29]"
                                        onChange={(e) => setFormData({...formData, agreePolicy: e.target.checked})}
                                    />
                                    <label className="text-[11px] text-blue-900 font-medium leading-relaxed">
                                        I confirm that the traveler names match their government ID. I also agree to the <span className="underline font-bold">Terms of Service</span> and <span className="underline font-bold">Cancellation Policy</span>.
                                    </label>
                                </div>

                                <button 
                                    type="submit" disabled={isProcessing}
                                    className="w-full bg-gray-900 text-white py-5 rounded-[20px] font-black text-sm shadow-xl shadow-gray-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : "Authorize Payment • ₹" + totalAmount.toLocaleString()}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN SUMMARY (Existing Design) */}
                    <div className="lg:col-span-4 space-y-6 sticky top-32">
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Booking Summary</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                    <span className="text-gray-400">Package Base</span>
                                    <span className="text-gray-800">INR {totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                    <span className="text-gray-400">Selection</span>
                                    <span className="text-[#AB7E29]">{selectionType}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                    <span className="text-gray-400">Travelers</span>
                                    <span className="text-gray-800">{adults} Adults, {children} Kids</span>
                                </div>
                                <hr className="border-dashed" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Grand Total</p>
                                        <p className="text-2xl font-black text-[#2C4A5E]">₹{totalAmount.toLocaleString()}</p>
                                    </div>
                                    <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Tax Included</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Shield className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-800 uppercase">Secure Payment</p>
                                    <p className="text-[10px] text-gray-400 font-medium"></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-800 uppercase">Instant Confirm</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Vouchers sent in 2 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageBookingPage;