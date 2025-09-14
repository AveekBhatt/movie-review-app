import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('watchlist');
  const [user, setUser] = useState({
    name: "",
    memberSince: "",
    stats: {
      reviews: 0,
      watchlist: 0,
      avgRating: 0
    },
    favoriteGenres: [],
    watchlist: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      
      const res = await axiosInstance.get('/users/fetchme');
      const userId = res.data.user._id;
      
      const userResponse = await axiosInstance.get('/users/' + userId);
      const userData = userResponse.data.user;
      
      const watchlistResponse = await axiosInstance.get('/users/' + userId + '/watchlist');
      
      // Get transformed watchlist
      const transformedWatchlist = await midtransformWatchlist(watchlistResponse.data.watchlist);
      
      // Get transformed reviews
      const transformedReviews = await midtransformReviews(userResponse.data.reviews);
      
      const transformedUser = {
        name: userData.name || userData.username || "User",
        memberSince: new Date(userData.createdAt).getFullYear() || 2023,
        stats: {
          reviews: userResponse.data.reviews?.length || 0,
          watchlist: watchlistResponse.data.watchlist?.length || 0,
          avgRating: calculateAverageRating(userResponse.data.reviews) || 0
        },
        favoriteGenres: userData.favoriteGenres || ["Action", "Drama", "Sci-Fi"],
        watchlist: transformedWatchlist,
        reviews: transformedReviews
      };
      
      setUser(transformedUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };
   
  const midtransformWatchlist = async (watchlist) => {
    if (!watchlist || watchlist.length === 0) return [];
    
    const moviesArray = [];

    for (const item of watchlist) {
      try {
        const response = await axiosInstance.get("/movies/" + item.movieId);
        const movie = response.data.movie;

        moviesArray.push({
          id: item._id, // Store the watchlist item ID for deletion
          movieId: item.movieId, // Store the movie ID
          movie: movie.title || "Unknown Movie",
          year: movie.release_year ? new Date(movie.release_year).getFullYear() : "Unknown",
          runtime: "120 min", // Default runtime since it's not in your movie data
          rating: movie.averagerating || 0,
          genres: movie.genre ? [movie.genre] : ["Unknown"],
          added: formatDate(item.createdAt) || "Recently"
        });
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    }

    return moviesArray;
  };

  const midtransformReviews = async (reviews) => {
    if (!reviews || reviews.length === 0) return [];
    
    const reviewsArray = [];

    for (const review of reviews) {
      try {
        const response = await axiosInstance.get("/movies/" + review.movieId);
        const movie = response.data.movie;

        reviewsArray.push({
          movie: movie.title || "Unknown Movie",
          year: movie.release_year ? new Date(movie.release_year).getFullYear() : "Unknown",
          rating: review.rating || 0,
          genres: movie.genre ? [movie.genre] : ["Unknown"],
          content: review.reviewtext || "No review text provided",
          date: formatDate(review.createdAt) || "Recent"
        });
      } catch (error) {
        console.error("Error fetching movie for review:", error);
        
        // Fallback to basic review data if movie fetch fails
        reviewsArray.push({
          movie: "Unknown Movie",
          year: "Unknown",
          rating: review.rating || 0,
          genres: ["Unknown"],
          content: review.reviewtext || "No review text provided",
          date: formatDate(review.createdAt) || "Recent"
        });
      }
    }

    return reviewsArray;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const res = await axiosInstance.get('/users/fetchme');
      const userId = res.data.user._id;
      const response = await axiosInstance.delete("/users/" + userId + "/watchlist/" + movieId);
      if(response.message){
      navigate("/Me")
      }
    
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist');
    }
  };

  useEffect(() => {
     const token = localStorage.getItem("token");
              if (!token) {
               navigate("/login");  
              return;
      }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchUser}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
          <div className="flex items-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
              alt={user.name} 
              className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-emerald-300"
            />
            <div>
              <h1 className="text-3xl font-bold mb-1 text-slate-800">{user.name}</h1>
              <p className="text-slate-600">Movie enthusiast since {user.memberSince}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center mb-6 max-w-md mx-auto">
            <div className="text-center px-6">
              <div className="text-2xl font-bold text-emerald-700">{user.stats.reviews}</div>
              <div className="text-slate-600 text-sm">Reviews</div>
            </div>
            <div className="text-center px-6 border-l border-r border-slate-200">
              <div className="text-2xl font-bold text-emerald-700">{user.stats.watchlist}</div>
              <div className="text-slate-600 text-sm">Watchlist</div>
            </div>
            <div className="text-center px-6">
              <div className="text-2xl font-bold text-emerald-700">{user.stats.avgRating}</div>
              <div className="text-slate-600 text-sm">Avg Rating</div>
            </div>
          </div>
          
          {/* Favorite Genres */}
          <div className="flex flex-wrap gap-2 justify-center">
            {user.favoriteGenres.map((genre, index) => (
              <span key={index} className="px-3 py-1 bg-emerald-100 rounded-full text-sm font-medium text-emerald-800 border border-emerald-200">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-300 my-6"></div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-300 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-600'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Review History
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'watchlist' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-600'}`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist
          </button>
        </div>

        {/* Watchlist Content */}
        {activeTab === 'watchlist' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Movies to Watch</h2>
            <p className="text-slate-600 mb-6">{user.watchlist.length} movies</p>
            
            {user.watchlist.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>Your watchlist is empty</p>
                <p className="text-sm mt-2">Start adding movies to see them here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {user.watchlist.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-slate-200 relative">
                    <button 
                      onClick={() => removeFromWatchlist(item.movieId)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Remove from watchlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    <div className="flex justify-between items-start mb-4 pr-8">
                      <h3 className="text-xl font-semibold text-slate-800">{item.movie}</h3>
                      
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-3 text-slate-700">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.runtime}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-amber-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.genres.map((genre, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-100 rounded text-sm font-medium text-emerald-800 border border-emerald-200">
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-slate-500 text-sm">Added {item.added}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Content */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Reviews</h2>
            <p className="text-slate-600 mb-6">{user.reviews.length} reviews</p>
            
            {user.reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>You haven't written any reviews yet</p>
                <p className="text-sm mt-2">Start reviewing movies to see them here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {user.reviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">{review.movie}</h3>
                    <p className="text-slate-600 mb-2">{review.movie} ({review.year})</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.genres.map((genre, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-100 rounded text-sm font-medium text-emerald-800 border border-emerald-200">
                          {genre}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <svg className="w-5 h-5 text-amber-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-slate-800">{review.rating}/10</span>
                    </div>
                    
                    <p className="text-slate-700 mb-4">{review.content}</p>
                    
                    <p className="text-slate-500 text-sm">© {review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProfilePage;