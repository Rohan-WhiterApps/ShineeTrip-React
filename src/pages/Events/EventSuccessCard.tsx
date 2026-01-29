import React from "react";
import {
  Check,
  Calendar,
  MapPin,
  Users,
  Mail,
  Download,
  Home,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventBookingSuccessCardProps {
  bookingData: any;
}

const EventBookingSuccessCard: React.FC<EventBookingSuccessCardProps> = ({
  bookingData,
}) => {
  const navigate = useNavigate();
  if (!bookingData) return null;

  const event = bookingData.booking.event || bookingData.booking;
  const ticket = bookingData.booking.eventTicket;
  const customer = bookingData.booking.customer;
    console.log(bookingData);
  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "TBA";

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">

        <div className="bg-[#263238] p-5 text-white text-center">
          <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            Ticket Confirmed
          </p>
          <h1 className="text-lg font-black">
            {bookingData.booking.event_title || event?.title}
          </h1>
        </div>

        <div className="p-6 space-y-5 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md space-y-4 text-sm">

            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Booking ID
              </p>
              <p className="font-bold text-gray-900 tracking-wide">
                {bookingData.booking.receipt}
              </p>
            </div>

            <div className="flex gap-3">
              <Calendar size={16} className="text-[#CA9C43]" />
              <span>{formatDate(bookingData.booking.event_date)}</span>
            </div>

            <div className="flex gap-3">
              <MapPin size={16} className="text-[#CA9C43]" />
              <span className="line-clamp-2">{event?.addr}</span>
            </div>

            <div className="flex gap-3">
              <Users size={16} className="text-[#CA9C43]" />
              <span>
                {bookingData.booking.ticket_qty} × {ticket?.name}
              </span>
            </div>

            <div className="flex gap-3">
              <Tag size={16} className="text-[#CA9C43]" />
              <span>₹{bookingData.booking.total_amount}</span>
            </div>

            <div className="pt-2 border-t text-xs text-gray-500 flex items-center gap-2">
              <Mail size={14} />
              {customer?.email}
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-gray-100 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-emerald-700"
          >
            <Download size={14} className="inline mr-1" />
            Download
          </button>

          <button
            onClick={() => navigate("/mybooking")}
            className="flex-1 border py-2 rounded-md text-sm font-semibold hover:bg-gray-50"
          >
            <Home size={14} className="inline mr-1" />
            My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventBookingSuccessCard;