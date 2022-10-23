const userModule = require("../models/authModule");

const isAdminTruee = async (req,res,next)=>{
    const userID = req.user.id;
    const us = await userModule.findOne({_id:userID});
    if (us.isAdmin==true) {
        next();
    }else{
        req.flash("validateError",[{msg:"YETKİSİZ GİRİŞ"}]);
        res.redirect("/profile");
    }
};

module.exports={isAdminTruee};