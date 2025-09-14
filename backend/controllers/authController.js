const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const Movie = require("../models/Moviemodel");
const Review = require("../models/Reviewmodel");

const login = async(req,res) => {
    const {email , password} = req.body;
    try{
        const userInfo = await User.findOne({email : email});
        if(!userInfo){
           return res.json({
              message : "User Does not exists"
           })
        }
        const isMatch = await bcrypt.compare(password,userInfo.password);
        if(!isMatch){
            return res.status(400).json({
                error : true,
                message : "Incorrect Password"
            })
        }
        const user = { user: userInfo };
        const accesstoken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accesstoken
        });

    }catch(error){
        return res.status(400).json({
            error : true,
            message : "Inavalid ERROR"
        })
    }
}

const signup = async(req,res) =>{
    const {username , email , password , profilePicture , usertype} = req.body;
    const isUser = await User.findOne({email:email});
    if(isUser){
        return res.json({
            message : "User Already Exists"
        })
    }
    const user = new User({
        username : username,
        email : email,
        password : password,
        profilePicture : profilePicture,
        usertype : usertype
    })
    await user.save();
    const accesstoken = jwt.sign({user} , process.env.JWT_SECRET, {
        expiresIn : "36000m",
    })
    return res.json({
        error : false,
        user,
        accesstoken,
        message: 'Registration Successful'
    });
}

module.exports = {login ,signup};