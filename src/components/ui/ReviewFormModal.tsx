import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';

// Props Interface
interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    onReviewPosted: () => void; 
}

// ReviewFormModal Component
const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, hotelId, onReviewPosted }) => {
    
    // --- State Management ---
    const [rating, setRating] = useState(0); 
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // --- Star Rating Handler (UI remains the same) ---
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-8 h-8 cursor-pointer transition-colors ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(i)}
                />
            );
        }
        return stars;
    };

    // --- Form Submission Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionError(null);

        if (rating === 0 || comment.trim().length < 5) {
            setSubmissionError("Please select a rating and write a comment (min 5 characters).");
            return;
        }

        setIsLoading(true);
        const token = sessionStorage.getItem('shineetrip_token');
        const userName = sessionStorage.getItem('shineetrip_name') || 'Guest Reviewer'; 

        // 💡 API Payload Construction based on the provided schema:
        const payload = {
            // Required for API POST /ratings (assuming API expects hotelId in the payload or URL)
            hotelId: hotelId, 
            
            // User details (using localStorage data)
            reviewerName: userName,
            reviewerAvatar: `https://i.pravatar.cc/150?u=${userName}`, // Dummy avatar for display
            
            // Rating details: Mapping single input rating to multiple categorical fields
            overallRating: rating,
            cleanliness: rating, // Mapped from overall rating
            accuracy: rating,     // Mapped from overall rating
            checkIn: rating,      // Mapped from overall rating
            communication: rating, // Mapped from overall rating
            
            // Other fields
            tags: [], // Assuming no tags input for now
            comment: comment.trim(),
            postedOn: new Date().toISOString(),
        };

        try {
            // ✅ POST API Endpoint
            const response = await fetch(`http://46.62.160.188:3000/ratings`, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // If 403 Forbidden or 400 Bad Request
                let errorMsg = 'Failed to submit review.';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {} 
                throw new Error(errorMsg);
            }

            // Success: Close modal, reset form, and refresh parent list
            alert('Review submitted successfully! Refreshing reviews.');
            onReviewPosted(); // Notify parent to refresh reviews list
            onClose();
            setRating(0); 
            setComment(''); 

        } catch (error) {
            console.error('Review submission error:', error);
            setSubmissionError(error instanceof Error ? error.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render Logic ---
    if (!isOpen) return null;
    
   

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 p-6">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Submit Your Review for Hotel ID: {hotelId}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Submission Form */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Rating Selection */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Your Rating (Overall Experience)</label>
                        <div className="flex gap-1">
                            {renderStars()}
                        </div>
                        {rating > 0 && <p className="text-sm text-gray-500 mt-2">You rated: {rating} out of 5</p>}
                    </div>

                    {/* Comment Area */}
                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-gray-700 font-semibold mb-2">Your Comment</label>
                        <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience (e.g., about cleanliness, service, check-in process)..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Error Message */}
                    {submissionError && (
                        <p className="text-red-500 text-sm mb-4">{submissionError}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || rating === 0}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 
                            ${(isLoading || rating === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D2A256] text-white hover:bg-[#c2934b]'}`}
                    >
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isLoading ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewFormModal;