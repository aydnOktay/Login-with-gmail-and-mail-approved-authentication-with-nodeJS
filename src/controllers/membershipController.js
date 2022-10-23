const memberModule = require("../models/membershipModel");
const { validationResult } = require("express-validator");

const membershipsShow = async (req, res, next) => {
    const memberss = await memberModule.find();
    res.render("members", { user: req.user, memb: memberss, layout: "./layout/homePagee" });
};

const membershipsForm = async (req, res, next) => {

    res.render("membersForm", { user: req.user, layout: "./layout/homePagee" });
};

const membershipPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("error",errors.array());
        res.redirect("/member/formm")
    }else{
        const newMember = new memberModule({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            adress:req.body.adress,
            price:req.body.price
        });

        const finn = await newMember.save();
        if (finn) {
            req.flash("successMessage",[{msg:"NEW Member is Added"}]);
            res.redirect("/member");
        }
    }
};

module.exports = {
    membershipsShow, membershipsForm, membershipPost
}