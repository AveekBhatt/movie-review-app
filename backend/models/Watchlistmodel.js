const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WatchlistSchema = new Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true,
        },
        movieId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Movie",
         required: true,
    },
    dateadded : {
        type : Date , 
        default :  new Date().getTime()
    }
})


module.exports = mongoose.model("WatchList" , WatchlistSchema);
