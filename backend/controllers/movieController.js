const User = require("../models/usermodel");
const Movie = require("../models/Moviemodel");
const Review = require("../models/Reviewmodel");
const WatchList = require("../models/Watchlistmodel");
const jwt = require("jsonwebtoken");

const getAllMovies = async(req,res) =>{
   console.log("HELLO")
    try {
    let { page = 1, limit = 10, genre, year, rating } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (genre) filter.genre = genre;
    if (year) filter.year = year;
    if (rating) filter.rating = { $gte: rating }; 

    const movies = await Movie.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalMovies = await Movie.countDocuments(filter);

    res.json({
      page,
      totalPages: Math.ceil(totalMovies / limit),
      totalMovies,
      movies,
    });
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getMovie = async(req,res) =>{
  const { id } = req.params;
  try {
  const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const reviews = await Review.find({ movieId: id }).sort({ createdAt: -1 });

    res.json({
      movie,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const PostMovie = async(req,res) =>{
   const {user} = req.user;
   if(user.usertype=="usertype"){
      return res.status(401).json({
          error : "Unauthorized"
      })
   }
   const { title, genre, year, cast, posterURL, director , synopsis ,release_year , averagerating } = req.body;

   try {
    const existingMovie = await Movie.findOne({ title : title });
    if (existingMovie) {
      return res.status(400).json({ error: "Movie already exists" });
    }

    const newMovie = new Movie({
      title : title,
      genre : genre,
      year : year,
      cast : cast,
      synopsis : synopsis,
      director : director,
      posterURL : posterURL,
      averagerating : averagerating,
      release_year : release_year
    });

    await newMovie.save();

    res.status(201).json({
      message: "Movie added successfully",
      movie: newMovie,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getReviewList = async(req,res) =>{
    const { id } = req.params; 
    try {
    const movie = await Movie.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const reviews = await Review.find({ movieId: id }).sort({ createdAt: -1 });

    res.json({
      movie: {
        _id: movie._id,
        title: movie.title,
        posterURL: movie.posterURL,
        averageRating: movie.averageRating,
      },
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const PostAReview = async (req, res) => {
  const { rating, reviewtext } = req.body;
  const id = req.params.id;
  const { user } = req.user;

  try {
    const movie = await Movie.findOne({ _id: id });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const existingReview = await Review.findOne({ userId: user._id, movieId: id });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this movie" });
    }

    const newReview = new Review({
      userId: user._id,
      movieId: id,
      rating,
      reviewtext,
    });

    await newReview.save();

    // 🔹 Recalculate average rating
    const reviews = await Review.find({ movieId: id });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    movie.averagerating = avgRating.toFixed(1); // keep 1 decimal place
    await movie.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
      newAverageRating: movie.averagerating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};





module.exports = { getAllMovies, getMovie ,  PostMovie , getReviewList , PostAReview};