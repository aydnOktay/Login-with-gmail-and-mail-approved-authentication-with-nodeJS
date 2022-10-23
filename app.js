const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv").config();
require("./src/config/dbConnect");
app.use(express.urlencoded({ extended: true }));
const flash =require("connect-flash");
const session = require("express-session");
const passport= require("passport");

// EJS AND TEMPLADE ENGİNE
const ejs = require("ejs");
const ejsLayout = require("express-ejs-layouts");
const authRouter = require("./src/routers/authRouter");
const userRouter = require("./src/routers/usersRouter");
const membershipRouter = require("./src/routers/membershipRouter");
app.use(ejsLayout);
app.use(express.static("public/admin"));
app.use("/uploads", express.static(path.join(__dirname,"/src/uploads")));
app.set("view engine","ejs");
app.set("views",path.resolve(__dirname,"./src/views"));
require('events').EventEmitter.defaultMaxListeners = 15;


const MongoDBStore = require('connect-mongodb-session')(session);
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: 'allExperinance' // sessionları saklayacagın koleksıyonun adı
});

// SESSİON AND FLASH MESSAGE
app.use(session({
    secret: process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    secret: 'somevalue',
    cookie:{
        maxAge:1000*60*60*24
    },
    store:sessionStore
}));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.validateError =req.flash("validateError");
    res.locals.successMessage =req.flash("successMessage");
    res.locals.error =req.flash("error");
    next();
});
app.use(passport.initialize());
app.use(passport.session());
require("./src/config/passportLocal.js");


app.use("/",authRouter);
app.use("/panel",userRouter);
app.use("/member",membershipRouter);




app.listen(process.env.PORT,()=>{
    console.log(`${process.env.PORT} is LİSTENİNG`);
});