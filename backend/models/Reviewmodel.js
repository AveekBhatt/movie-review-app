const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
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
   rating: {
     type: Number,
     required: true,
     min: 1,
     max: 5,
   },
   reviewtext :{
     type : String,
     required : true
   },
   timestamp :{
     type : Date , 
     default :  new Date().getTime()
   }
})


module.exports = mongoose.model("Review" , reviewSchema);