const membershipRouter = require("express").Router();
const membershipController = require("../controllers/membershipController");
const memberMiddleware = require("../middlewares/memberMiddleware");
const isAdmin= require("../middlewares/isAdmin");
const sessionControl = require("../middlewares/sessionControl");

membershipRouter.get("/",sessionControl.isLogin,membershipController.membershipsShow);
membershipRouter.get("/formm",sessionControl.isLogin,isAdmin.isAdminTruee,membershipController.membershipsForm);
membershipRouter.post("/form",sessionControl.isLogin,isAdmin.isAdminTruee,memberMiddleware.newMemberAdd(),membershipController.membershipPost);

module.exports=membershipRouter;