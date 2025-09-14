require("dotenv").config();

const express = require("express");
const cors = require("cors");
const config = require("./config.json");
const useroutes = require("./routes/useroutes");
const movieroutes = require("./routes/movieroutes");
const authroutes = require("./routes/authroutes");


const mongoose = require('mongoose');
mongoose.connect(config.connectionstring)



const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));


app.use("/users",useroutes );
app.use("/movies", movieroutes);
app.use("/auth", authroutes);


app.listen(5555, () => console.log("Server running on port 5555"));

module.exports = app;
