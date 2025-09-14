const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title : {
        type : String ,
        required : true
    },
    genre : {
        type : String ,
        required : true,
    },
    release_year : {
        type : Date ,
        required : true
    },
    director :{
        type : String ,
        required : true,
    },
    cast :{
        type: [String],
        required: true,
    },
    synopsis :{
        type : String,
        required : true,
    },
    posterURL: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/, "Please enter a valid image URL"],
    },
    averagerating : {
      type: Number,
       min: 0,
       max: 5,
      default: 0,
    }
})

module.exports = mongoose.model("Movie" , MovieSchema);