// File: components/ui/PolicyModal.tsx

import React from 'react';
import { X, Shield, RefreshCcw } from 'lucide-react';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelName: string;
    policiesHTML: string;
    refundRulesHTML: string;
}

// Helper function to safely render HTML content
const renderHTML = (htmlString: string) => {
    // WARNING: For production, use DOMPurify to clean HTML to prevent XSS attacks.
    return { __html: htmlString };
};

export const PolicyModal: React.FC<PolicyModalProps> = ({ 
    isOpen, 
    onClose, 
    hotelName, 
    policiesHTML, 
    refundRulesHTML 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[90] flex justify-center items-center p-4">
            
            {/* 🟢 NEW: Inline Style block for dynamically loaded HTML content. 
                Yeh Tailwind ke default styles ko override karta hai taaki Lists (ul/ol) 
                aur Headings (h1/h2) render ho saken. */}
            <style>
                {`
                    .policy-content h1, .policy-content h2, .policy-content h3 {
                        font-weight: 700;
                        margin-top: 1.5rem;
                        margin-bottom: 0.5rem;
                        color: #1f2937;
                    }
                    .policy-content h1 { font-size: 1.5rem; }
                    .policy-content h2 { font-size: 1.25rem; }
                    .policy-content h3 { font-size: 1.125rem; }
                    .policy-content p {
                        margin-bottom: 1rem;
                        line-height: 1.6;
                    }
                    .policy-content ul, .policy-content ol {
                        margin-left: 1.5rem;
                        margin-bottom: 1rem;
                        padding-left: 0.5rem; /* Lists ko indent karne ke liye */
                    }
                    .policy-content ul {
                        list-style-type: disc; /* Bullet points ke liye */
                    }
                    .policy-content ol {
                        list-style-type: decimal; /* Numbered list ke liye */
                    }
                    .policy-content li {
                        margin-bottom: 0.5rem;
                        line-height: 1.6;
                    }
                `}
            </style>
            
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all">
                
                {/* Header (Unchanged) */}
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {hotelName}: Policies & Rules
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-8">
                    
                    {/* 1. Hotel Policies Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-[#D2A256]">
                            <Shield className="w-6 h-6" />
                            <h3>Hotel Policies (T&Cs)</h3>
                        </div>
                        {policiesHTML ? (
                            <div 
                                // Class added to target dynamic HTML content
                                className="text-gray-700 space-y-4 leading-relaxed policy-content" 
                                dangerouslySetInnerHTML={renderHTML(policiesHTML)} 
                            />
                        ) : (
                            <p className="text-gray-500 italic">No specific policies provided by the hotel.</p>
                        )}
                    </div>

                    {/* 2. Cancellation and Refund Rules Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-[#22C55E]">
                            <RefreshCcw className="w-6 h-6" />
                            <h3>Cancellation & Refund Rules</h3>
                        </div>
                        {refundRulesHTML ? (
                            <div 
                                // Class added to target dynamic HTML content
                                className="text-gray-700 space-y-4 leading-relaxed policy-content" 
                                dangerouslySetInnerHTML={renderHTML(refundRulesHTML)} 
                            />
                        ) : (
                            <p className="text-gray-500 italic">No refund rules specified.</p>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
};