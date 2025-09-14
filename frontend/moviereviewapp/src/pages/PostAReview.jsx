import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const PostAReview = () => {
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch movie details
  useEffect(() => {
     const token = localStorage.getItem("token");
              if (!token) {
               navigate("/login");  
              return;
      }
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/movies/${id}`);
        setMovie(response.data.movie);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!movie || rating === 0 || reviewText.length < 10) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/movies/"+  id + '/reviews', {
        rating,
        reviewtext: reviewText
      });
      console.log(response)
      navigate("/MoviePage/" + id)
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const characterCount = reviewText.length;
  const isSubmitDisabled = characterCount < 10 || rating === 0 || submitting;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Movie not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">Write a Review</h1>
          <p className="text-gray-400">Share your thoughts about this movie</p>
        </div>

        {/* Movie Info Section */}
        <div className="mb-8 bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Movie Details</h2>
          
          <div className="flex items-center mb-4">
            <img 
              src={movie.posterURL || "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"} 
              alt={movie.title} 
              className="w-24 h-36 rounded-md object-cover mr-4"
            />
            <div>
              <h3 className="text-xl font-bold text-white">{movie.title}</h3>
              <p className="text-gray-400">
                {new Date(movie.release_year).getFullYear()} • {movie.genre}
              </p>
              <p className="text-gray-400">Director: {movie.director}</p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-8 bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Your Rating</h2>
          <p className="text-gray-400 mb-4">Rate this movie (1-5 stars)</p>
          
          <div className="flex space-x-2 mb-4 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-4xl focus:outline-none transition-transform hover:scale-110"
                disabled={submitting}
              >
                {star <= rating ? (
                  <span className="text-yellow-400 drop-shadow">★</span>
                ) : (
                  <span className="text-gray-600">☆</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">Selected: {rating}/5 stars</p>
        </div>

        {/* Review Text Section */}
        <div className="mb-8 bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Your Review</h2>
          <p className="text-gray-400 mb-4">Write your review</p>
          
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What did you think of this movie? Share your thoughts, favorite scenes, or what made it memorable..."
            className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            disabled={submitting}
          />
          
          <div className={`text-sm mt-2 ${characterCount < 10 ? 'text-red-400' : 'text-gray-400'}`}>
            {characterCount} characters • Minimum 10 characters
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-900 text-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex space-x-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-6 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isSubmitDisabled
                ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostAReview;