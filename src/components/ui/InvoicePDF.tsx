import React from 'react';
import { format } from 'date-fns';

interface InvoiceProps {
    invoiceData: any;
}

const InvoicePDF: React.FC<InvoiceProps> = ({ invoiceData }) => {
    if (!invoiceData) return null;

    const { 
        invoiceNumber, invoiceDate, customer, order, items, 
        total, subTotal, totalTax, billingAddress 
    } = invoiceData;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4">
            {/* 🖨️ PRINT BUTTON (Screen par dikhega, PDF mein nahi) */}
            <div className="max-w-[800px] mx-auto mb-6 flex justify-end no-print">
                <button 
                    onClick={handlePrint}
                    className="bg-[#D2A256] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#b88d45] transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print / Download PDF
                </button>
            </div>

            {/* 📄 MAIN INVOICE AREA */}
            <div className="bg-white max-w-[800px] mx-auto shadow-2xl rounded-lg overflow-hidden font-sans text-gray-800 printable-content" id="printable-invoice">
                
                {/* 🟢 TOP BAR (Green Status) */}
                <div className="bg-[#2e7d32] text-white p-5 flex items-center gap-4">
                    <div className="bg-white rounded-full p-1 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2e7d32]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl uppercase tracking-tight">Payment Done</h1>
                        <p className="text-xs opacity-90 leading-tight">Your booking is confirmed. This is your official electronic receipt.</p>
                    </div>
                </div>

                <div className="p-10">
                    {/* 🔵 HEADER */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                Thank {customer?.first_name || 'Guest'} {customer?.last_name || ''} for choosing Shinetrip
                            </h2>
                            <p className="text-sm text-gray-500 mt-2 font-medium">A confirmation email has been sent to <span className="text-blue-600 underline">{customer?.email}</span></p>
                        </div>
                        <div className="border-2 border-black p-3 rounded-md text-center min-w-[150px]">
                            <p className="text-[10px] font-bold uppercase tracking-[3px] text-gray-400 mb-1">Invoice ID</p>
                            <p className="text-base font-black tracking-tight">{invoiceNumber}</p>
                        </div>
                    </div>

                    {/* 📅 DYNAMIC STAY DETAILS */}
                    <div className="border-b-2 border-gray-100 pb-8 mb-8">
                        <div className="flex justify-between font-bold text-[11px] uppercase text-gray-400 mb-4 tracking-widest">
                            <span>Travel Date: {invoiceDate ? format(new Date(invoiceDate), 'EEE, MMM d, yyyy') : 'N/A'}</span>
                            <span>Order ID: #{order?.id}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                            <div className="flex-1">
                                <h3 className="font-black text-xl text-blue-900 uppercase tracking-tight">Shinetrip Luxury Stay</h3>
                                <p className="text-sm font-bold text-gray-500 mt-1">{items?.[0]?.description || 'Hotel Booking'}</p>
                                <p className="text-xs font-semibold text-[#D2A256] uppercase mt-1">Class: Economy / Deluxe</p>
                            </div>
                            
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">{items?.[0]?.startDate || '12:00 PM'}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-In</p>
                                </div>
                                
                                <div className="h-10 w-[2px] bg-gray-200"></div>

                                <div className="text-center">
                                    <p className="text-2xl font-black text-gray-900">{items?.[0]?.endDate || '11:00 AM'}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-Out</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 💰 COST AND BILLING */}
                    <div className="mb-10">
                        <h4 className="bg-gray-900 text-white p-2 px-4 font-bold text-xs uppercase tracking-[2px] mb-6 rounded-sm">Cost and billing Information</h4>
                        
                        <div className="space-y-4 px-2">
                            <div className="flex justify-between font-black text-xl border-b-2 border-gray-900 pb-3">
                                <span>Total Amount Due</span>
                                <span className="text-green-700">₹ {total}</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <div className="flex justify-between text-sm font-bold text-gray-600">
                                    <span>Base fare / Room Price</span>
                                    <span>₹ {subTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-600">
                                    <span>Taxes & Fees (GST)</span>
                                    <span>₹ {totalTax}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-400 italic">
                                    <span>Convenience Fee</span>
                                    <span>₹ 0.00</span>
                                </div>
                            </div>

                            <div className="flex justify-between font-black text-lg pt-4 border-t border-dashed border-gray-300">
                                <span className="uppercase text-gray-400 text-sm">Total Price per stay</span>
                                <span className="text-2xl">₹ {total}</span>
                            </div>
                        </div>
                    </div>

                    {/* 📝 POLICIES */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="font-black text-xs uppercase mb-4 text-gray-900 border-b pb-2 tracking-widest">Policies, Rules and Restrictions</h4>
                        <ul className="text-[10px] text-gray-500 space-y-2 list-disc pl-4 font-medium leading-relaxed">
                            <li>Please carry this voucher and a valid Govt. ID (Aadhar/Passport) during check-in.</li>

                            <li className="text-gray-900 font-bold italic">Billing Address: {billingAddress || 'As per profile'}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 🎨 PRINT STYLES */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white !important; padding: 0 !important; }
                    .no-print { display: none !important; }
                    .printable-content { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        max-width: 100% !important; 
                        width: 100% !important;
                        border: none !important;
                    }
                }
            `}} />
        </div>
    );
};

export default InvoicePDF;