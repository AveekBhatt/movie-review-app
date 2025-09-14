const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const  { getMe, updateMe ,  getWatchlist , PostWatchlist , deleteFromWatchlist , currentUser} = require("../controllers/userContoller");


router.get("/fetchme", authenticateToken ,currentUser);
router.get("/:id", authenticateToken ,getMe);
router.put("/:id", authenticateToken, updateMe);
router.get("/:Id/watchlist", authenticateToken, getWatchlist);
router.post("/:Id/watchlist", authenticateToken, PostWatchlist);
router.delete("/:Id/watchlist/:movieId", authenticateToken, deleteFromWatchlist);
module.exports = router;
