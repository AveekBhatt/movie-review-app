const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;


const userSchema = new Schema({
    username :{
        type : String,
        required : true,
        unique: true, 
    },
    email :{
        type : String,
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true, 
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
   },
   profilePicture: {
      type: String,
      required : true,
      default: "https://example.com/default-profile.png", 
   },
   joindate : {
       type : Date , 
       default :  new Date().getTime()
   },
   usertype :{
     type : String,
     default : "usertype"
   }
})

userSchema.pre("save" , async function(next){
     if(!this.isModified("password")){
        return next();
     }
     try{
         const salt = await bcrypt.genSalt(10);
         this.password = await bcrypt.hash(this.password,salt);
         next();
     }catch(error){
        next(error)
     }
}) 


module.exports = mongoose.model("User" , userSchema);
