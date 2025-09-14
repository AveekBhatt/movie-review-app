import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import bannerimg from "../assets/star-wars-the-rise-of-skywalker-banner-min.jpg";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const featuredRef = useRef(null);
  const trendingRef = useRef(null);
  const [AllMovies, setAllMovies] = useState([]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  const getAllMovies = async (page = 1) => {
    try {
      console.log("PAGE : " + page);
      const response = await axiosInstance.get(`/movies?page=${page}`);
      setAllMovies((prevMovies) => [
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
      <div className="relative w-full h-[500px]">
        <img
          src={bannerimg}
          alt="Banner"
          className="w-full h-full object-cover rounded-lg"
        />

        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white bg-black/40">
          <div className="flex items-center space-x-2 text-sm mb-2">
            <span className="text-yellow-400">★ 5</span>
            <span>• 2017</span>
            <span>• Sci-Fi</span>
            <span>• 2h 28m</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Star Wars : <span className="text-purple-500">The Rise Of Skywalker</span>
          </h1>

          <p className="mt-4 max-w-2xl text-gray-200">
            An epic space adventure that follows a crew of explorers as they
            venture into the unknown reaches of the galaxy, discovering ancient
            civilizations and cosmic mysteries.
          </p>

          <div className="mt-6 flex space-x-4">
             <Link to={`/MoviePage/68c68e60d4e8747bfe466dcf`} className="relative w-48 flex-shrink-0 group">
            <button className="flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold">
                ⓘ More Info
            </button>
           </Link> 
          </div>
        </div>
      </div>

      {/* Featured Movies */}
      <div className="bg-black text-white px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Movies</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll(featuredRef, "left")}
              className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full"
            >
              ◀
            </button>
            <button
              onClick={() => scroll(featuredRef, "right")}
              className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full"
            >
              ▶
            </button>
          </div>
        </div>
        <div
          ref={featuredRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
        >
          {AllMovies.map((item, index) => 
            <div key={index} className="relative w-48 flex-shrink-0 group">
              <Link to={`/MoviePage/${item._id}`} key={index} className="relative w-48 flex-shrink-0 group">
              <img
                src={item.posterURL}
                alt={item.title}
                className="rounded-lg w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center p-3 transition">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm">
                  ⭐ {item.averagerating} |{" "}
                  {new Date(item.release_year).getFullYear()}
                </p>
                <p className="text-xs">{item.genre}</p>
              </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Trending Movies */}
      <div className="bg-black text-white px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Movies</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll(trendingRef, "left")}
              className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full"
            >
              ◀
            </button>
            <button
              onClick={() => scroll(trendingRef, "right")}
              className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full"
            >
              ▶
            </button>
          </div>
        </div>
        <div
          ref={trendingRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
        >
          {AllMovies.map((item, index) => 
            <div key={index} className="relative w-48 flex-shrink-0 group">
              <Link to={`/MoviePage/${item._id}`} key={index} className="relative w-48 flex-shrink-0 group">
              <img
                src={item.posterURL}
                alt={item.title}
                className="rounded-lg w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center p-3 transition">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm">
                  ⭐ {item.averagerating} |{" "}
                  {new Date(item.release_year).getFullYear()}
                </p>
                <p className="text-xs">{item.genre}</p>
              </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
