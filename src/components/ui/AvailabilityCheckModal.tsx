import React, { useState } from 'react';
import { X, MapPin, Calendar, Users, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
// NOTE: Using simple functional modal structure now.

interface AvailabilityCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomData: any; 
    searchParams: {
        location: string;
        checkIn: string;
        checkOut: string;
        adults: string;
        children: string;
    };
    onProceed: (roomData: any) => void; 
}

// Defining Shardcn/Custom components inline
const CustomDialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b">
        {children}
    </div>
);
const CustomDialogTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 id="availability-dialog-title" className="text-xl font-bold leading-none tracking-tight">
        {children}
    </h2>
);
const CustomDialogFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6 pt-0 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-3">
        {children}
    </div>
);


export const AvailabilityCheckModal: React.FC<AvailabilityCheckModalProps> = ({
    isOpen,
    onClose,
    roomData,
    searchParams,
    onProceed,
}) => {
    const [loading, setLoading] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'unavailable' | 'error'>('idle');
    const [priceConfirmed, setPriceConfirmed] = useState<number | null>(null);

    const token = localStorage.getItem('shineetrip_token');
    const customerIdStr = localStorage.getItem('shineetrip_uid'); 

    // UI Helpers
    const checkInDate = searchParams.checkIn ? new Date(searchParams.checkIn) : null;
    const checkOutDate = searchParams.checkOut ? new Date(searchParams.checkOut) : null;
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // Initial price calculation (outside checkAvailability scope)
    const initialRoomPrice = parseFloat(roomData?.price?.retail_tax_price) || 0;


    // 🎯 API Call to Check Availability via Tentative Order Creation
    const checkAvailability = async () => {
        if (!token || !customerIdStr) {
            setAvailabilityStatus('error');
            setSubmissionError('Authorization Error: User ID not found. Please log in again.');
            return;
        }

        setLoading(true);
        setAvailabilityStatus('idle');
        setPriceConfirmed(null);
        setSubmissionError(null);

        const totalAdults = parseInt(searchParams.adults);
        const totalChildren = parseInt(searchParams.children);
        const customerId = parseInt(customerIdStr); 

        const payload = {
            orderRooms: [
                {
                    propertyId: parseInt(roomData?.propertyId || roomData?.hotelId || 0), 
                    roomId: parseInt(roomData?.id), 
                    adults: totalAdults,
                    children: totalChildren,
                    checkIn: searchParams.checkIn,
                    checkOut: searchParams.checkOut, 
                    roomPrice: initialRoomPrice, 
                }
            ],
            totalPrice: initialRoomPrice * 1, 
            paymentMethod: "online",
            currency: "INR",
            notes: { bookingSource: "web-portal-check" },
            customerId: customerId, 
        };
        
        try {
            const apiUrl = `http://46.62.160.188:3000/order/create`; 
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            const responseText = await response.text();

            if (response.ok) {
                const responseData = JSON.parse(responseText);
                setPriceConfirmed(responseData.totalPrice || payload.totalPrice);
                setAvailabilityStatus('available');
            } else {
                let errorMessage = `Order Check failed (Status: ${response.status}).`;
                
                try {
                    const errorJson = JSON.parse(responseText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    if (response.status === 404) {
                         errorMessage = "Error 404: API endpoint '/order/create' not found.";
                    }
                }
                setSubmissionError(errorMessage);
                setAvailabilityStatus('unavailable');
            }

        } catch (error) {
            console.error("Availability Check API Error:", error);
            // ✅ FIX APPLIED: Using the correct state setter
            setAvailabilityStatus('error');
            setSubmissionError("Network error. Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleProceed = () => {
        onProceed(roomData);
        onClose(); 
    };
    
    // Agar modal open nahi hai, toh kuch render mat karo
    if (!isOpen) return null;

    // --- Custom Modal Rendering (Pure HTML/Tailwind) ---
    return (
        // Modal Overlay (Replaced Dialog)
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            {/* Modal Content Card */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all overflow-hidden" onClick={(e) => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 pb-4 border-b relative">
                    <h2 id="availability-dialog-title" className="text-xl font-bold text-gray-900">Confirm Availability</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{roomData?.room_type || 'Selected Room'}</h3>
                    
                    {/* Search Details Review */}
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>**Location:** {searchParams.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>**Check-in:** {checkInDate ? format(checkInDate, 'MMM dd, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>**Check-out:** {checkOutDate ? format(checkOutDate, 'MMM dd, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>**Guests:** {searchParams.adults} Adults, {searchParams.children} Children</span>
                        </div>
                    </div>

                    {/* Status Message */}
                    {availabilityStatus === 'available' && (
                        <div className="flex items-center p-3 bg-green-50 border border-green-300 rounded-md text-green-700">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Room is **AVAILABLE** for **₹ {priceConfirmed?.toLocaleString() || initialRoomPrice.toLocaleString()}**
                        </div>
                    )}
                    {(availabilityStatus === 'unavailable' || submissionError) && (
                        <div className="flex items-center p-3 bg-red-50 border border-red-300 rounded-md text-red-700">
                            <XCircle className="w-5 h-5 mr-2" />
                            {submissionError || '**Room is Not Available** for these dates. Please modify dates/guests.'}
                        </div>
                    )}
                    
                    <hr className="border-gray-200" />
                </div>

                {/* Modal Footer/Actions */}
                <div className="p-6 pt-0 flex justify-end gap-3">
                    <button
                        onClick={checkAvailability}
                        disabled={loading || availabilityStatus === 'unavailable'}
                        className="py-2 px-6 rounded-lg border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 transition-colors flex items-center justify-center"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Checking...' : 'Check Availability'}
                    </button>
                    
                    <button
                        onClick={handleProceed}
                        disabled={availabilityStatus !== 'available'}
                        className={`py-2 px-6 rounded-lg text-white font-semibold transition-colors ${
                            availabilityStatus === 'available' ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};