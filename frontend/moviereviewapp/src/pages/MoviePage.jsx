import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from '../utils/axiosInstance';
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';

const MoviePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams(); 
  
  const getMovie = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/movies/" + id);
      setMovie(response.data);  
    } catch (error) {
      console.log(error);
      setError("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const getMe = async () => {
    try {
      const res = await axiosInstance.get(`/users/fetchme`);
      console.log("User data:", res.data);
      
      if (res.data.reviews && res.data.reviews.length > 0) {
        const hasReviewedThisMovie = res.data.reviews.some(review => 
          review.movieId === id || review.movie_id === id
        );
        
        console.log("Has reviewed this movie:", hasReviewedThisMovie);
        setHasReviewed(hasReviewedThisMovie);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };
  
  const Watchlist = async () => {
    try {
      const res = await axiosInstance.get(`/users/fetchme`);
      const userId = res.data.user._id;
      
      if (isInWatchlist) {
        await axiosInstance.delete(`/users/${userId}/watchlist/${id}`);
        setIsInWatchlist(false);
      } else {
        await axiosInstance.post(`/users/${userId}/watchlist`, {
          movieId: id
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.log("Watchlist error:", error);
    }
  };
  
  const CheckWatchlist = async () => {
    try {
      const res = await axiosInstance.get(`/users/fetchme`);
      const userId = res.data.user._id;
      const response = await axiosInstance.get(`/users/${userId}/watchlist`);
      
      const isMovieInWatchlist = response.data.some(item => 
        item.movieId === id || item._id === id
      );
      
      setIsInWatchlist(isMovieInWatchlist);
    } catch (error) {
      console.log("Check watchlist error:", error);
    }
  };
  
  useEffect(() => {
     const token = localStorage.getItem("token");
              if (!token) {
               navigate("/login");  
              return;
      }
    const fetchData = async () => {
      try {
        setLoading(true);
        await getMovie();
        await getMe();
        await CheckWatchlist();
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={getMovie}
            className="mt-4 px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!movie || !movie.movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Movie not found</p>
        </div>
      </div>
    );
  }

  const { title, posterURL, averagerating, release_year, genre, director, cast = [] } = movie.movie;
  const year = new Date(release_year).getFullYear();

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative h-96 bg-gradient-to-r from-black to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://www.legendary.com/wp-content/uploads/2015/04/film_thedarkknight_featureimage_desktop_1600x9001.jpg')" }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative h-full flex items-end pb-8">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <img 
                src={posterURL}
                alt={title} 
                className="w-32 h-48 rounded-md object-cover mr-4"
              />
              <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{averagerating}/5</span>
              </div>
              
              <span>{year}</span>
              
              <span>2hr 39 min</span>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded-md text-sm">
                  {genre}
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              {isInWatchlist ? (
              <button
                className={`px-6 py-2  bg-gray-600 rounded-md font-semibold  cursor-not-allowed`}
              >
                Added to WatchList
              </button>) : (

               <button
                onClick={Watchlist}
                className={`px-6 py-2 bg-green-600 rounded-md font-semibold`}
              >
                Add to WatchList
              </button>)
              }
              
              {hasReviewed ? (
                <button 
                  disabled
                  className="px-6 py-2 bg-gray-600 text-gray-400 rounded-md font-semibold cursor-not-allowed"
                >
                  Review Posted
                </button>
              ) : (
                <Link to={`/WriteAReview/` + id} className="relative w-48 flex-shrink-0 group">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors w-full">
                    Post A Review
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'cast' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast & Crew
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'trailers' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('trailers')}
          >
            Trailers
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Movie Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-semibold">Director:</span> {director}</p>
                  <p><span className="font-semibold">Release Year:</span> {year}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Runtime:</span> 2hr 39 min</p>
                  <p><span className="font-semibold">Genres:</span> {genre}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cast.map((person, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{person.split(" ")[0]}</h3>
                      <p className="text-gray-400">{person.split(" ").slice(1).join(" ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trailers' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Trailers</h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-center text-gray-400">Official Trailer #1</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <div className="space-y-6">
                {movie.reviews && movie.reviews.length > 0 ? (
                  movie.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-800 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">{review.userId}</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-gray-400">{review.rating}/5</span>
                        </div>
                    </div>
                    {review.reviewtext && <p className="text-gray-300">{review.reviewtext}</p>}
                  </div>
                ))
                ) : (
                  <p className="text-gray-400">No reviews yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default MoviePage;