require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);

const app = express();
const store = new MongodbStore({uri: process.env.MONGO_URI, collection:'sessions'})

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret:'my secret', resave: false, saveUninitialized: false, store:store}))

app.set('view engine', 'ejs');
app.set('views','views');

const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');

app.use(authRoutes);
app.use(userRoutes);

mongoose.connect(process.env.MONGO_URI).then(result=>{
    app.listen(process.env.PORT || 3000);
    console.log("Database connected");
}).catch(err=>console.log(err));

