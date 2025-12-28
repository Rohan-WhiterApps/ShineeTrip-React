import React, { useState, useEffect, useCallback } from 'react';
import { Star, Sparkles, CheckCircle, Key, MessageSquare, Loader2, X } from 'lucide-react';
import { format } from 'date-fns'; 

// --- Review Form Modal Component (Unchanged) ---

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    onReviewPosted: () => void;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, hotelId, onReviewPosted }) => {
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    
    const [overallRating, setOverallRating] = useState(0);
    const [cleanliness, setCleanliness] = useState(0);
    const [staff, setStaff] = useState(0);
    const [services, setServices] = useState(0);
    const [food, setFood] = useState(0); 

    const [summary, setSummary] = useState('');
    const [comment, setComment] = useState('');
    
    const token = sessionStorage.getItem('shineetrip_token');

    useEffect(() => {
        if (isOpen) {
            setOverallRating(0);
            setCleanliness(0);
            setStaff(0);
            setServices(0);
            setFood(0);
            setSummary('');
            setComment('');
            setFormError(null);
        }
    }, [isOpen]);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !hotelId || overallRating === 0 || cleanliness === 0 || staff === 0 || services === 0 || food === 0) {
            setFormError("Please log in and provide a rating for all categories (1-5 stars).");
            return;
        }

        setSubmitting(true);
        setFormError(null);
    
        let customerIdToSend: number | null = null;
        const userString = sessionStorage.getItem('shineetrip_user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                customerIdToSend = user.id || user.customerId || null;
        } catch (e) {
                console.error('Failed to parse shineetrip_user');
        }
        }

        if (!customerIdToSend) {
            const dbIdString = sessionStorage.getItem('shineetrip_db_customer_id');
            if (dbIdString) {
                const parsed = parseInt(dbIdString, 10);
                if (!isNaN(parsed)) customerIdToSend = parsed;
            }
        }

        if (!customerIdToSend) {
            setFormError("User profile not found. Please log in again.");
            setSubmitting(false);
            return;
        }

        const dataToSend = new FormData();
    
        dataToSend.append('propertyId', hotelId);
        dataToSend.append('customerId', String(customerIdToSend)); 
        dataToSend.append('overallRating', String(overallRating));
        dataToSend.append('cleanliness', String(cleanliness));
        dataToSend.append('staff', String(staff));
        dataToSend.append('services', String(services));
        dataToSend.append('food', String(food));
        
        if (summary) dataToSend.append('summary', summary);
        if (comment) dataToSend.append('comment', comment);

        try {
            const response = await fetch('http://46.62.160.188:3000/ratings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: dataToSend,
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || `API Error: ${response.status}`);
                } catch {
                    throw new Error(`Failed to submit review. Status: ${response.status}`);
                }
            }

            onReviewPosted();
            onClose();

        } catch (error) {
            console.error('Submission error:', error);
            setFormError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setSubmitting(false);
        }
    };
    
    if (!isOpen) return null;

    // Helper to render rating buttons (Unchanged)
    const RatingSelector = ({ label, value, setValue }: { label: string, value: number, setValue: (v: number) => void }) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{label} ({value}/5)</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                            star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => setValue(star)}
                    />
                ))}
            </div>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Submit Your Review</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Rating Selectors */}
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <RatingSelector label="Overall Rating" value={overallRating} setValue={setOverallRating} />
                        <RatingSelector label="Cleanliness" value={cleanliness} setValue={setCleanliness} />
                        <RatingSelector label="Staff" value={staff} setValue={setStaff} />
                        <RatingSelector label="Services" value={services} setValue={setServices} />
                        <RatingSelector label="Food" value={food} setValue={setFood} />
                    </div>

                    {/* Summary and Comment */}
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Review Title (Summary)</label>
                        <input
                            id="summary"
                            type="text"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g., Great stay, highly recommend!"
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Detailed Comment</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            placeholder="Share your detailed experience..."
                        />
                    </div>
                    
                    {formError && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {formError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting || overallRating === 0 || cleanliness === 0 || staff === 0 || services === 0 || food === 0}
                        className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-colors ${
                            (submitting || overallRating === 0 || cleanliness === 0 || staff === 0 || services === 0 || food === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D2A256] hover:bg-[#c2934b]'
                        }`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                            </>
                        ) : (
                            'Post Review'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Customer and Review Interface (Unchanged) ---
interface CustomerDetails {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Review {
    id: number;
    reviewerName: string;
    reviewerAvatar: string;
    overallRating: number; 
    comment: string;
    postedOn: string;
    createdAt: string; 
    tags: string[];
    hotelId?: string | number; 
    property: string | number;
    customer: CustomerDetails;
    cleanliness: number; 
    staff: number; 
    services: number; 
    food: number; 
    summary: string;
}

interface HotelReviewsProps {
    hotelId: string | number;
}

const HotelReviews: React.FC<HotelReviewsProps> = ({ hotelId }) => {
    // --- States ---
    const [averageRatings, setAverageRatings] = useState<any>(null);
    const [allReviews, setAllReviews] = useState<Review[]>([]); 
    const [reviews, setReviews] = useState<Review[]>([]); 
    const [showAllReviews, setShowAllReviews] = useState(false); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const token = sessionStorage.getItem('shineetrip_token');
    
    const dummyTags = ['Clean', 'Great Hospitality', 'Fast Response', 'Value for Money'];

    // --- Fetching Functions ---
    const refreshReviews = useCallback(async () => {
        if (!hotelId || !token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        
        let fetchedSummary = null;

        try {
            // 1. Fetch Summary (API endpoint for average summary)
            const summaryUrl = `http://46.62.160.188:3000/ratings/average/summary?hotelId=${hotelId}`;
            const summaryResponse = await fetch(summaryUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            if (summaryResponse.ok) {
                const data = await summaryResponse.json();
                fetchedSummary = data; // Store summary data
                
                // 🔥 CRITICAL FIX 1: Data ko flatten karke set karein taaki UI mein N/A na aaye
                if (data.averageRatings) {
                    setAverageRatings({
                        totalReviews: data.totalReviews || 0,
                        // Category-wise scores ko seedhe top level par laayein
                        averageRating: data.averageRatings.overall || 0,
                        cleanliness: data.averageRatings.cleanliness || 0,
                        staff: data.averageRatings.staff || 0,
                        services: data.averageRatings.services || 0,
                        food: data.averageRatings.food || 0,
                        ratingBreakdown: {} 
                    });
                } else {
                    setAverageRatings(null);
                }

            } else {
                 console.warn("Could not fetch average summary. Calculating client-side average.");
                setAverageRatings(null);
            }

            // 2. Fetch Individual Reviews
            const reviewsUrl = `http://46.62.160.188:3000/ratings/property/${hotelId}`;
            const reviewsResponse = await fetch(reviewsUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            
            if (reviewsResponse.ok) {
                const data: any[] = await reviewsResponse.json();
                
                // Data Mapping
                const mappedReviews: Review[] = data.map(review => {
                    const customerData = review.customer;
                    const defaultAvatar = `https://i.pravatar.cc/150?u=${customerData?.email || review.id}`; 
                    const fullName = `${customerData?.first_name || ''} ${customerData?.last_name || 'Guest'}`.trim();

                    return {
                        ...review,
                        reviewerName: fullName || 'Guest User',
                        reviewerAvatar: defaultAvatar,
                        hotelId: review.property,
                        tags: [],
                        postedOn: review.createdAt,
                        cleanliness: review.cleanliness || 0,
                        staff: review.staff || 0,
                        services: review.services || 0,
                        food: review.food || 0,
                        overallRating: review.overallRating || 0,
                        summary: review.summary || '',
                        comment: review.comment || '',
                    } as Review;
                });
                
                // 🟢 FIX 1.3: Client-Side Fallback Average Calculation (If summary API fails)
                if (!fetchedSummary && mappedReviews.length > 0) {
                    const count = mappedReviews.length;
                    const total = mappedReviews.reduce((acc, r) => ({
                        overall: acc.overall + r.overallRating,
                        cleanliness: acc.cleanliness + r.cleanliness,
                        staff: acc.staff + r.staff,
                        services: acc.services + r.services,
                        food: acc.food + r.food,
                    }), { overall: 0, cleanliness: 0, staff: 0, services: 0, food: 0 });

                    setAverageRatings({
                        totalReviews: count,
                        averageRating: total.overall / count,
                        cleanliness: total.cleanliness / count,
                        staff: total.staff / count,
                        services: total.services / count,
                        food: total.food / count,
                        ratingBreakdown: {} // Keep empty if not needed
                    });
                }
                
                // 🟢 FIX 2.2: Store ALL reviews in a dedicated state
                setAllReviews(mappedReviews);
                
                // Show top 4 reviews initially
                setReviews(mappedReviews.slice(0, 4)); 
            } else {
                 throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
            }

        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError(error instanceof Error ? error.message : 'Failed to load ratings or reviews.');
        } finally {
            setLoading(false);
        }
    }, [hotelId, token]);

    // Main useEffect for fetching reviews (Unchanged)
    useEffect(() => {
        refreshReviews(); 
    }, [refreshReviews]);


    // --- Helper functions for UI (Unchanged) ---
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
            );
        }
        return stars;
    };
    
    // 🛑 FIX 3: Total average ab directly averageRatings se lega (jo calculated ya fetched hai)
    const renderAverageRating = () => {
        return averageRatings?.averageRating?.toFixed(1) || 'N/A';
    };

    // Date formatter (Unchanged)
    const formatReviewDate = (dateString: string) => {
        if (!dateString) return 'Just now';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString; 
        }
    }


    // --- Conditional Render (Unchanged) ---
    if (!token) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                Please log in to view detailed ratings and reviews.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading Reviews...
            </div>
        );
    }
    
    if (error) {
        return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">Error: {error}</div>;
    }
    
    const calculatedAvgRating = parseFloat(renderAverageRating());
    // Total review count ab summary API se aayega ya client-side calculated hoga
    const totalReviewCount = averageRatings?.totalReviews || allReviews.length; 
    
    // 🟢 FIX: Reviews to Display (Is variable ko use karke rendering logic clean hoga)
    const reviewsToDisplay = showAllReviews ? allReviews : reviews;


    // --- UI Rendering ---
    return (
        <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-baseline gap-4">
                    {/* Overall Score Dynamic */}
                    <h2 className="text-6xl font-bold text-gray-900">
                        {renderAverageRating()} 
                    </h2>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {calculatedAvgRating >= 4.5 ? 'Guest Favorite' : 'Ratings Summary'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {totalReviewCount} Reviews based on their rating & reviews.
                        </p>
                    </div>
                </div>

                {/* Submit Review Button (Unchanged) */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#D2A256] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c2934b] transition-colors shadow-md"
                >
                    <MessageSquare className="w-4 h-4" />
                    Submit Your Review
                </button>
                
            </div>
        
            {/* Rating Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-8 border-t border-b border-gray-200 py-8">
                {/* Overall Rating Breakdown (Unchanged) */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-4">Overall Rating</h4>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-3">{rating}</span>
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-800 rounded-full" style={{ width: (averageRatings?.ratingBreakdown?.[rating] / averageRatings?.totalReviews) * 100 || 0 + '%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
        
                {/* Categorical Scores - Now fixed */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cleanliness</h4>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{averageRatings?.cleanliness?.toFixed(1) || 'N/A'}</div>
                    <Sparkles className="w-8 h-8 text-gray-800" />
                </div>
        
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Staff</h4>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{averageRatings?.staff?.toFixed(1) || 'N/A'}</div>
                    <CheckCircle className="w-8 h-8 text-gray-800" />
                </div>
        
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Services</h4>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{averageRatings?.services?.toFixed(1) || 'N/A'}</div>
                    <Key className="w-8 h-8 text-gray-800" />
                </div>
            </div>
        
            {/* Tags (Unchanged) */}
            <div className="flex flex-wrap gap-4 mb-8">
                 {dummyTags.map((tag, idx) => ( 
                    <div key={idx} className="bg-gray-100 px-6 py-3 rounded-full text-gray-700 font-medium text-sm">
                        {tag}
                    </div>
                ))}
            </div>
        
            {/* 🔥 CRITICAL FIX: Reviews Grid Dynamic and Conditional Rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Check if there are ANY reviews */}
                {allReviews.length > 0 ? (
                    
                    // Render the selected list (top 4 or all)
                    reviewsToDisplay.map((reviewItem, idx) => ( 
                        <div key={reviewItem.id || idx} className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                {/* User details */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <img src={reviewItem.reviewerAvatar || "https://i.pravatar.cc/150?img=32"} alt="User" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?img=32" }} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{reviewItem.reviewerName || 'Guest User'}</div>
                                        <div className="text-xs text-gray-500">{formatReviewDate(reviewItem.createdAt)}</div>
                                    </div>
                                </div>
                                {/* Stars Dynamic - Using overallRating */}
                                <div className="flex gap-1">
                                    {renderStars(reviewItem.overallRating)}
                                </div>
                            </div>
                            {/* Review Text Dynamic */}
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {reviewItem.comment || reviewItem.summary || 'No comment provided.'}
                            </p>
                            <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50">
                                Show more
                            </button>
                        </div>
                    ))
                ) : (
                    // Empty State Message (Agar allReviews array mein kuch na ho)
                    <div className="md:col-span-2 text-center text-gray-500 p-4">
                        Be the first to leave a review for this hotel!
                    </div>
                )}
            </div>
            
            
            <div className="mt-8 text-center">
                
{/*                 {totalReviewCount > reviews.length && !showAllReviews && (
//                     <button 
//                         onClick={() => setShowAllReviews(true)}
//                         className="bg-white border border-gray-200 px-8 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
//                     >
//                         Show all {totalReviewCount} reviews
//                     </button>
                )} */}
    
              
{/*                 {showAllReviews && (
//                     <button 
//                         onClick={() => setShowAllReviews(false)}
//                         className="bg-white border border-gray-200 px-8 py-3 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
//                     >
//                         Show top reviews
//                     </button>
                )} */}
            </div>
        </div>
        
        {/* Review Form Modal Rendering (Unchanged) */}
        <ReviewFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            hotelId={String(hotelId)}
            onReviewPosted={refreshReviews} 
        />
      </>
    );
};

export default HotelReviews;