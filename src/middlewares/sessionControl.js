
const isLogin = (req,res,next)=>{
    if (req.isAuthenticated()) {
        return next()
    }else{
        req.flash("validateError",[{msg:"PLEASE LOGİN"}]);
        res.redirect("/login");
    }

};

const isLogout = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        return next()
    }else{
        res.redirect("/homePage");
    }
};

module.exports={
    isLogin,isLogout
}