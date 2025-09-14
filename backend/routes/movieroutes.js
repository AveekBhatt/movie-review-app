const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const  { getAllMovies, getMovie ,  PostMovie , getReviewList , PostAReview} = require("../controllers/movieController")


router.get("/", authenticateToken ,getAllMovies);
router.get("/:id", authenticateToken, getMovie);
router.post("/", authenticateToken, PostMovie);
router.get("/:id/reviews", authenticateToken, getReviewList);
router.post("/:id/reviews", authenticateToken, PostAReview);
module.exports = router;
