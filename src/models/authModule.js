const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 10
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 10
    },
    adress:{
        type:String,
        trim:true,
        minLength:3,
        maxLength:50
    },
    emaill: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    emailActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "default.png",
    },
    googleId:{
        type:String
    }

}, { collection: "alExperinance", timestamps: true });

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;