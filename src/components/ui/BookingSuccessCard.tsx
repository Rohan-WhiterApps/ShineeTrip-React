import React from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingSuccessCardProps {
    roomName: string;
    orderId: string;
}

const BookingSuccessCard: React.FC<BookingSuccessCardProps> = ({ roomName, orderId }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/mybooking'); 
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 text-center transform transition-all scale-100">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
                
                <p className="text-lg text-gray-700 mb-6">
                    Your booking for <span className="font-semibold">{roomName}</span> has been successfully confirmed.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg text-sm text-left border border-green-200 mb-6">
                    <p className="font-semibold text-gray-900 mb-1">Room: {roomName}</p>
                    <p className="text-gray-600">Order Reference ID: <span className="font-mono text-xs">{orderId}</span></p>
                </div>

                <button
                    onClick={handleGoHome}
                    className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto gap-2"
                >
                    <Home className="w-5 h-5" />
                    Go to My Bookings
                </button>
            </div>
        </div>
    );
};

export default BookingSuccessCard;