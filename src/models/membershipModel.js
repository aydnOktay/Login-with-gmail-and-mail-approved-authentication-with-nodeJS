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
    price:{
        type:String,
        default: "5500TL"
    },
    avatar:{
        type:String,
        default:"member.png"
    }

}, { collection: "membership", timestamps: true });

const userModel = mongoose.model("use2r", userSchema);
module.exports = userModel;