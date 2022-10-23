const mongoose =require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{useUnifiedTopology:true , useNewUrlParser:true })
    .then(()=>console.log("Connected to database"))
    .catch( hata => console.log("Could not connect to database"))
