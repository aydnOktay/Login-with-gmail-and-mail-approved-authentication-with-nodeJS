const userRouter = require("express").Router();
const userController =require("../controllers/userController");
const isAdminTrue = require("../middlewares/isAdmin");
const sessionControl = require("../middlewares/sessionControl");


userRouter.get("/users",sessionControl.isLogin,isAdminTrue.isAdminTruee,userController.usersShow);

module.exports=userRouter;

