const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const Movie = require("../models/Moviemodel");
const Review = require("../models/Reviewmodel");
const WatchList = require("../models/Watchlistmodel");

const currentUser = async(req,res) =>{
  console.log("ASFSaf")
    const { _id } = req.user.user;
    console.log(req.user.user._id)
    try {
    const user = await User.findOne({_id : _id});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const reviews = await Review.find({ userId: _id }).sort({ timestamp: -1 });
    res.json({
      user,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getMe = async(req,res) =>{
    const { id } = req.params;
    try {
    const user = await User.findOne({_id : id});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const reviews = await Review.find({ userId: id }).sort({ timestamp: -1 });

    res.json({
      user,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const updateMe = async(req,res) =>{
    const { id } = req.params;
    const { username, email, password, profilePicture } = req.body;

  try {
    let user = await User.findOne({_id : id});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    if (password) {
      user.password = password
    }

    await user.save();

    const updatedUser = await User.findOne({_id : id});

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const getWatchlist = async(req,res) => {
  const { Id } = req.params;

  try {
    const user = await User.findOne({_id : Id})
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const watchlist = await WatchList.find({ userId: Id }).sort({ createdAt: -1 });

    res.json({
      user: user,
      watchlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const PostWatchlist = async(req,res) =>{
  const { Id } = req.params; 
  const { movieId } = req.body;

  try {
    const user = await User.findOne({_id : Id});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const movie = await Movie.findOne({_id : movieId});
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const exists = await WatchList.findOne({ userId: Id, movieId:movieId });
    if (exists) {
      return res.status(400).json({ error: "Movie already in watchlist" });
    }

    const newWatchlistItem = new WatchList({
      userId: Id,
      movieId,
    });

    await newWatchlistItem.save();

    res.status(201).json({
      message: "Movie added to watchlist",
      watchlistItem: newWatchlistItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

const deleteFromWatchlist = async(req,res) =>{
  const { Id, movieId } = req.params; 
  try {
    const watchlistItem = await WatchList.findOne({ userId: Id, movieId: movieId });
    if (!watchlistItem) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }

    await WatchList.findOneAndDelete({ userId: Id, movieId : movieId });

    res.json({ message: "Movie removed from watchlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getMe, updateMe ,  getWatchlist , PostWatchlist , deleteFromWatchlist , currentUser};