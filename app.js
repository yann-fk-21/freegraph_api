require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI).then(result=>{
    app.listen(process.env.PORT || 3000);
    console.log("Connected");
}).catch(err=>console.log(err));

