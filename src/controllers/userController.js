const userModule = require("../models/authModule");

const usersShow = async (req, res, next) => {
        const users = await userModule.find();
        res.render("users", { user:req.user, userss: users, layout: "./layout/homePagee" });
};

module.exports = {
    usersShow
}