const authRouter = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const multerConfig = require("../config/multer_config");
const sessionControl = require("../middlewares/sessionControl");
const passport = require("passport");


authRouter.get("/login", sessionControl.isLogout, authController.loginFormShow);
authRouter.post("/login", sessionControl.isLogout, authController.loginFormPost);


authRouter.get("/register", sessionControl.isLogout, authController.registerFormShow);
authRouter.post("/register", sessionControl.isLogout, authMiddleware.newUserAdd(), authController.registerFormPost);

authRouter.get("/forgetPassword", sessionControl.isLogout, authController.forgetPasswordFormShow);
authRouter.post("/forgetPassword", sessionControl.isLogout, authController.forgetPasswordFormPost);
authRouter.get("/reset-password/:tokenPassword/:idPassword", authController.resetPasswordStep1);
authRouter.post("/reset-password", authController.resetPasswordStep2);

authRouter.get("/verifyCode/:token/:id", authController.verifyEmail);
authRouter.post("/verifyCode", sessionControl.isLogout, authController.verifyEmailPost);

authRouter.get("/homePage", sessionControl.isLogin, authController.homePage);
authRouter.get("/logout", sessionControl.isLogin, authController.logout);

authRouter.get("/profile", sessionControl.isLogin, authController.profile);
authRouter.post("/profil-guncelle", sessionControl.isLogin, multerConfig.single("avatar"), authController.profilePost);

// GOOGLE LOGİN
authRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile"] }));
authRouter.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/login");
});

module.exports = authRouter;