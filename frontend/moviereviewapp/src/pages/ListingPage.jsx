import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../utils/axiosInstance';
import { Link, useNavigate } from "react-router-dom";

const ListingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [minRating, setMinRating] = useState(0);
  
  /*
  const movies = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 8.8 },
    { id: 2, title: 'The Shawshank Redemption', genre: 'Drama', year: 1994, rating: 9.3 },
    { id: 3, title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 9.0 },
    { id: 4, title: 'Pulp Fiction', genre: 'Crime', year: 1994, rating: 8.9 },
    { id: 5, title: 'Forrest Gump', genre: 'Drama', year: 1994, rating: 8.8 },
    { id: 6, title: 'The Matrix', genre: 'Sci-Fi', year: 1999, rating: 8.7 },
    { id: 7, title: 'Goodfellas', genre: 'Crime', year: 1990, rating: 8.7 },
    { id: 8, title: 'Interstellar', genre: 'Sci-Fi', year: 2014, rating: 8.6 },
    { id: 9, title: 'Parasite', genre: 'Thriller', year: 2019, rating: 8.6 },
    { id: 10, title: 'The Silence of the Lambs', genre: 'Thriller', year: 1991, rating: 8.6 },
    { id: 11, title: 'La La Land', genre: 'Romance', year: 2016, rating: 8.0 },
    { id: 12, title: 'Whiplash', genre: 'Drama', year: 2014, rating: 8.5 },
    { id: 13, title: 'The Departed', genre: 'Crime', year: 2006, rating: 8.5 },
    { id: 14, title: 'The Prestige', genre: 'Mystery', year: 2006, rating: 8.5 },
    { id: 15, title: 'The Lion King', genre: 'Animation', year: 1994, rating: 8.5 },
  ];
*/
   const [movies , setmovies] = useState([]);
  const genres = ['All Genres', ...new Set(movies.map(movie => movie.genre))];
const years = [
  'All Years',
  ...new Set(
    movies
      .map(movie => new Date(movie.release_year).getFullYear().toString())
      .sort((a, b) => b - a)
  )
];

    const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All Genres' || movie.genre === selectedGenre;
    const matchesYear = selectedYear === 'All Years' || new Date(movie.release_year).getFullYear().toString() === selectedYear;
    const matchesRating = movie.averagerating >= minRating;
    
    return matchesSearch && matchesGenre && matchesYear && matchesRating;
  });

   const getAllMovies = async (page = 1) => {
       try {
         console.log("PAGE : " + page);
         const response = await axiosInstance.get(`/movies?page=${page}`);
         setmovies((prevMovies) => [
           ...prevMovies,
           ...response.data.movies,
         ]);
         console.log(response);
       } catch (error) {
         console.log(error);
       }
    };

    useEffect(() => {
         const token = localStorage.getItem("token");
              if (!token) {
               navigate("/login");  
              return;
        }
        getAllMovies(1);
        getAllMovies(2);
        return () => {};
      }, []);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">All Movies</h1>
          <p className="text-gray-300">Discover your next favorite film</p>
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full p-4 pl-12 pr-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Filters</h2>
            
            {/* Genre Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-300">Genre</h3>
              <select
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            {/* Year Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-300">Year</h3>
              <select
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-300">Min Rating</h3>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="ml-3 text-purple-400 font-medium">{minRating.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All Genres');
                setSelectedYear('All Years');
                setMinRating(0);
              }}
              className="w-full py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </aside>

          {/* Movie Results */}
          <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {filteredMovies.length} movies found
              </h2>
            </div>
            
            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {filteredMovies.map(movie => (
           <div key={movie.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow hover:transform hover:scale-105 duration-300">
             <Link to={`/MoviePage/${movie._id}`} className="relative w-48 flex-shrink-0 group">
             {/* Poster Section */}
             <div className="h-48 relative">
          <img
        src={movie.posterURL}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 right-3 bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded">
        {movie.genre}
      </div>
             </div>

             {/* Content Section */}
             <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 text-white">{movie.title}</h3>
      <div className="flex justify-between text-sm text-gray-400">
        <span>{movie.genre}</span>
        <span>{new Date(movie.release_year).getFullYear()}</span>
      </div>
      <div className="mt-2 flex items-center">
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <span className="ml-1 text-white">{movie.averagerating.toFixed(1)}</span>
      </div>
             </div>
             </Link>
             </div>
             ))}

            </div>
            
            {filteredMovies.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No movies found matching your criteria
              </div>
            )}
          </main>
        </div>
      </div>


    </div>
    </>
  );
};

export default ListingPage;