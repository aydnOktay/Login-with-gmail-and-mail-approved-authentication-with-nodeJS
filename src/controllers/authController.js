const userModule = require("../models/authModule");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");


// LOGİN
const loginFormShow = (req, res, next) => {
    res.render("login", { layout: "./layout/authLayout" });

}
const loginFormPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        req.flash("validateError", errors.array());
        res.redirect("/register");

    } else {

        passport.authenticate("local", {
            successRedirect: "/homePage",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next);

    }
}

// REGİSTER
const registerFormShow = (req, res, next) => {
    res.render("register", { layout: "./layout/authLayout" });
}
const registerFormPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        req.flash("validateError", errors.array());
        res.redirect("/register");

    } else {

        const userFindAdd = await userModule.findOne({ emaill: req.body.emaill });
        if (userFindAdd) {
            await userModule.findByIdAndRemove({ _id: userFindAdd._id });
        }

        if (userFindAdd && userFindAdd.emailActive == true) {
            req.flash("successMessage", [{ msg: "Database saved this user" }]);
            res.redirect("/login");
        } else if ((userFindAdd && userFindAdd.emailActive == false) || userFindAdd == null) {

            const newUser = new userModule({
                id: req.body._id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                adress: req.body.adress,
                emaill: req.body.emaill,
                password: await bcrypt.hash(req.body.password, 10)
            });
            await newUser.save();

            const jsonInformation = { id: newUser.id, emaill: newUser.emaill };
            const otpCode = Math.ceil(Math.random() * (1000000 - 100000) + 100000).toString();
            const secretKey = process.env.JWT_SECRET_KEY + "-" + otpCode + "-" + newUser.password;
            const jwtToken = jwt.sign(jsonInformation, secretKey, { expiresIn: "5m" });

            // EMAİL SEND
            let transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                }
            });
            await transport.sendMail({
                from: "NODE JS",
                to: newUser.emaill,
                subject: "MAİL CONFİRM",
                html: `
                                
                                <!DOCTYPE html>
                                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                                <head>
                                    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
                                    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
                                    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
                                    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                                    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
                                
                                    <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
                                
                                    <!-- CSS Reset : BEGIN -->
                                    <style>
                                
                                        /* What it does: Remove spaces around the email design added by some email clients. */
                                        /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
                                        html,
                                body {
                                    margin: 0 auto !important;
                                    padding: 10px !important;
                                    height: 100% !important;
                                    width: 100% !important;
                                    background: #f1f1f1;
                                }
                                
                                /* What it does: Stops email clients resizing small text. */
                                * {
                                    -ms-text-size-adjust: 100%;
                                    -webkit-text-size-adjust: 100%;
                                }
                                
                                /* What it does: Centers email on Android 4.4 */
                                div[style*="margin: 16px 0"] {
                                    margin: 0 !important;
                                }
                                
                                /* What it does: Stops Outlook from adding extra spacing to tables. */
                                table,
                                td {
                                    mso-table-lspace: 0pt !important;
                                    mso-table-rspace: 0pt !important;
                                }
                                
                                /* What it does: Fixes webkit padding issue. */
                                table {
                                    border-spacing: 0 !important;
                                    border-collapse: collapse !important;
                                    table-layout: fixed !important;
                                    margin: 0 auto !important;
                                }
                                
                                /* What it does: Uses a better rendering method when resizing images in IE. */
                                img {
                                    -ms-interpolation-mode:bicubic;
                                }
                                
                                /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
                                a {
                                    text-decoration: none;
                                }
                                
                                /* What it does: A work-around for email clients meddling in triggered links. */
                                *[x-apple-data-detectors],  /* iOS */
                                .unstyle-auto-detected-links *,
                                .aBn {
                                    border-bottom: 0 !important;
                                    cursor: default !important;
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
                                
                                /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
                                .a6S {
                                    display: none !important;
                                    opacity: 0.01 !important;
                                }
                                
                                /* What it does: Prevents Gmail from changing the text color in conversation threads. */
                                .im {
                                    color: inherit !important;
                                }
                                
                                /* If the above doesn't work, add a .g-img class to any image in question. */
                                img.g-img + div {
                                    display: none !important;
                                }
                                
                                /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
                                /* Create one of these media queries for each additional viewport size you'd like to fix */
                                
                                /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
                                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                                    u ~ div .email-container {
                                        min-width: 320px !important;
                                    }
                                }
                                /* iPhone 6, 6S, 7, 8, and X */
                                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                                    u ~ div .email-container {
                                        min-width: 375px !important;
                                    }
                                }
                                /* iPhone 6+, 7+, and 8+ */
                                @media only screen and (min-device-width: 414px) {
                                    u ~ div .email-container {
                                        min-width: 414px !important;
                                    }
                                }
                                
                                
                                    </style>
                                
                                    <!-- CSS Reset : END -->
                                
                                    <!-- Progressive Enhancements : BEGIN -->
                                    <style>
                                
                                        .primary{
                                    background: #17bebb;
                                }
                                .bg_white{
                                    background: #ffffff;
                                }
                                .bg_light{
                                    background: #f7fafa;
                                }
                                .bg_black{
                                    background: #000000;
                                }
                                .bg_dark{
                                    background: rgba(0,0,0,.8);
                                }
                                .email-section{
                                    padding:2.5em;
                                }
                                
                                /*BUTTON*/
                                .btn{
                                    padding: 10px 15px;
                                    display: inline-block;
                                }
                                .btn.btn-primary{
                                    border-radius: 5px;
                                    background: #17bebb;
                                    color: #ffffff;
                                }
                                .btn.btn-white{
                                    border-radius: 5px;
                                    background: #ffffff;
                                    color: #000000;
                                }
                                .btn.btn-white-outline{
                                    border-radius: 5px;
                                    background: transparent;
                                    border: 1px solid #fff;
                                    color: #fff;
                                }
                                .btn.btn-black-outline{
                                    border-radius: 0px;
                                    background: transparent;
                                    border: 2px solid #000;
                                    color: #000;
                                    font-weight: 700;
                                }
                                .btn-custom{
                                    color: rgba(0,0,0,.3);
                                    text-decoration: underline;
                                }
                                
                                h1,h2,h3,h4,h5,h6{
                                    font-family: 'Poppins', sans-serif;
                                    color: #000000;
                                    margin-top: 0;
                                    font-weight: 400;
                                }
                                
                                body{
                                    font-family: 'Poppins', sans-serif;
                                    font-weight: 400;
                                    font-size: 15px;
                                    line-height: 1.8;
                                    color: rgba(0,0,0,.4);
                                }
                                
                                a{
                                    color: #17bebb;
                                }
                                
                                table{
                                }
                                /*LOGO*/
                                
                                .logo h1{
                                    margin: 0;
                                }
                                .logo h1 a{
                                    color: #17bebb;
                                    font-size: 24px;
                                    font-weight: 700;
                                    font-family: 'Poppins', sans-serif;
                                }
                                
                                /*HERO*/
                                .hero{
                                    position: relative;
                                    z-index: 0;
                                }
                                
                                .hero .text{
                                    color: rgba(0,0,0,.3);
                                }
                                .hero .text h2{
                                    color: #000;
                                    font-size: 34px;
                                    margin-bottom: 0;
                                    font-weight: 200;
                                    line-height: 1.4;
                                }
                                .hero .text h3{
                                    font-size: 24px;
                                    font-weight: 300;
                                }
                                .hero .text h2 span{
                                    font-weight: 600;
                                    color: #000;
                                }
                                
                                .text-author{
                                    bordeR: 1px solid rgba(0,0,0,.05);
                                    max-width: 50%;
                                    margin: 0 auto;
                                    padding: 2em;
                                }
                                .text-author img{
                                    border-radius: 50%;
                                    padding-bottom: 20px;
                                }
                                .text-author h3{
                                    margin-bottom: 0;
                                }
                                ul.social{
                                    padding: 0;
                                }
                                ul.social li{
                                    display: inline-block;
                                    margin-right: 10px;
                                }
                                
                                /*FOOTER*/
                                
                                .footer{
                                    border-top: 1px solid rgba(0,0,0,.05);
                                    color: rgba(0,0,0,.5);
                                }
                                .footer .heading{
                                    color: #000;
                                    font-size: 20px;
                                }
                                .footer ul{
                                    margin: 0;
                                    padding: 0;
                                }
                                .footer ul li{
                                    list-style: none;
                                    margin-bottom: 10px;
                                }
                                .footer ul li a{
                                    color: rgba(0,0,0,1);
                                }
                                
                                
                                @media screen and (max-width: 500px) {
                                
                                
                                }
                                
                                
                                    </style>
                                
                                
                                </head>
                                
                                <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
                                    <center style="width: 100%; background-color: #f1f1f1;">
                                    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                                      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                                    </div>
                                    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
                                        <!-- BEGIN BODY -->
                                      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                                          <tr>
                                          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                  <tr>
                                                      <td class="logo" style="text-align: center;">
                                                        <h1><a href="#">OKTAY SOFTWARE</a></h1>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                          </tr><!-- end tr -->
                                                <tr>
                                          <td valign="middle" class="hero bg_white" style="padding: 2em 0 4em 0;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td style="padding: 0 2.5em; text-align: center; padding-bottom: 3em;">
                                                        <div class="text">
                                                            <h2>Onay Kodu ile üyeliğinizi onaylayın</h2>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                      <td style="text-align: center;">
                                                          <div class="text-author">
                                                              <img src="images/person_2.jpg" alt="" style="width: 100px; max-width: 600px; height: auto; margin: auto; display: block;">
                                                              <h3 class="name">Oktay Aydın</h3>
                                                              <span class="position">CEO, Founder at AYDİN SOFTWARE</span>
                                                               <p><a href="#" class="btn btn-primary">${otpCode}</a></p>
                                                           </div>
                                                      </td>
                                                    </tr>
                                            </table>
                                          </td>
                                          </tr><!-- end tr -->
                                      <!-- 1 Column Text + Button : END -->
                                      </table>
                                     
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr><!-- end: tr -->
                                        <tr>
                                        </tr>
                                      </table>
                                
                                    </div>
                                  </center>
                                </body>
                                </html>
            
                             `
            }, (error, info) => {
                if (error) {
                    console.log("ERROR ", error);
                }
                console.log("MAİL SEND");
                transport.close();
            });

            // EMAİL END

            req.flash("successMessage", [{ msg: "Please , You enter sended to your email verify code" }]);
            res.redirect("/verifyCode/" + jwtToken + "/" + newUser.id);

        }
    }
}

// FORGET PASSWORD
const forgetPasswordFormShow = (req, res, next) => {
    res.render("forgetPassword", { layout: "./layout/authLayout" })
}
const forgetPasswordFormPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("validateError", errors.array());
        res.redirect("/forgetPassword");
    } else {
        const userFind = await userModule.findOne({ emaill: req.body.emaill, emailActive: true });
        if (userFind) {
            const jwtInformation = { id: userFind._id, emaill: userFind.emaill };
            const secretKey = process.env.RESET_PASSWORD_SECRET + "-" + userFind.id;
            const jwtToken = jwt.sign(jwtInformation, secretKey, { expiresIn: "5m" });
            const url = process.env.WEB_SITE + "reset-password/" + jwtToken + "/" + userFind.id;

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.GMAIL_USER, // generated ethereal user
                    pass: process.env.GMAIL_PASS, // generated ethereal password
                },
            });
            // send mail with defined transport object
            await transporter.sendMail({
                from: '"NODE JS DENEME',
                to: userFind.emaill,
                subject: "PASSWORD UPDATE",
                text: "GO TO THIS LINK TO CREATE YOUR PASSWORD " + url,
            }, (error, info) => {
                if (error) {
                    console.log("ERROR " + error);
                }
                console.log("MAİL SEND");
                transporter.close();
            });

            req.flash("successMessage", [{ msg: "Please click on the link sent to your e-mail." }]);
            res.redirect("/login");

        } else {
            req.flash("validateError", [{ msg: "THİS USER NOT FOUND OR EMAİL FALSE" }]);
            res.redirect("/forgetPassword");
        }
    }
}
const resetPasswordStep1 = async (req, res, next) => {
    const linkID = req.params.idPassword;
    const linkToken = req.params.tokenPassword;

    if (linkID && linkToken) {
        const userrr = await userModule.findOne({ _id: linkID });
        if (userrr) {
            const secretKey = process.env.RESET_PASSWORD_SECRET + "-" + userrr.id;
            jwt.verify(linkToken, secretKey, async (e, decoded) => {
                if (e) {
                    req.flash("validateError", [{ msg: "this user was not found" }]);
                    res.redirect("/forgetPassword");
                } else {
                    res.render("new_password", { id: linkID, token: linkToken, layout: "./layout/authLayout" });
                }
            });
        } else {
            req.flash("validateError", [{ msg: "this user was not found" }]);
            res.redirect("/forgetPassword");
        }
    } else {
        req.flash("validateError", [{ msg: "please send request again" }]);
        res.redirect("/forgetPassword");
    }
}
const resetPasswordStep2 = async (req, res, next) => {
    const formID = req.body.id;
    const formToken = req.body.token;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("validateError", errors.array());
        res.redirect("/reset-password/" + formToken + "/" + formID);
    } else {
        const userFind = await userModule.findOne({ _id: formID, emailActive: true });
        const secretKey = process.env.RESET_PASSWORD_SECRET + "-" + userFind.id;
        jwt.verify(formToken, secretKey, async (e, decoded) => {
            if (e) {
                req.flash("validateError", [{ msg: "TOKEN OR ID İS FAİLED" }]);
                res.redirect("/forgetPassword");
            } else {
                const passwordHash = await bcrypt.hash(req.body.password, 10);
                const finallyy = await userModule.findByIdAndUpdate(decoded.id, { password: passwordHash });
                if (finallyy) {
                    req.flash("successMessage", [{ msg: "PASSWORD UPDATED" }]);
                    res.redirect("/login");
                } else {
                    req.flash("validateError", [{ msg: "FAİLED" }]);
                    res.redirect("/login");
                }
            }
        });
    }


}

// HOMEPAGE
const homePage = async (req, res, next) => {
    const userrr = await userModule.find();
    res.render("index", { user: req.user, layout:"./layout/homePagee" });
}

// VERİFY
const verifyEmail = async (req, res, next) => {
    const linkToken = req.params.token;
    const linkID = req.params.id;

    if (linkToken && linkID) {
        const userFind = await userModule.findOne({ _id: linkID });
        if (userFind) {
            res.render("verifyCode", { id: linkID, token: linkToken, layout: "./layout/authLayout" });
        } else {
            req.flash("validateError", [{ msg: "This User Not Found" }]);
            res.redirect("/login")
        }
    } else {
        req.flash("validateError", [{ msg: "TOKEN OR İD NOT FOUND" }]);
        res.redirect("/login")
    }

}
const verifyEmailPost = async (req, res, next) => {
    const formID = req.body.id;
    const formToken = req.body.token;

    if (formID && formToken) {

        const userrFind = await userModule.findOne({ _id: formID });
        const secretKey = process.env.JWT_SECRET_KEY + "-" + req.body.verifyCodeForm + "-" + userrFind.password;
        if (userrFind) {
            jwt.verify(formToken, secretKey, async (e, decoded) => {
                if (e) {
                    req.flash("validateError", [{ msg: "VERİFY CODE FALSE" }]);
                    res.redirect("/verifyCode/" + formToken + "/" + formID);
                } else {
                    const update = await userModule.findByIdAndUpdate(formID, { emailActive: true });
                    req.flash("successMessage", [{ msg: "VERİFY İS MAİL , LETS GO LOGİN" }]);
                    res.redirect("/login");
                }
            });
        } else {
            req.flash("validateError", [{ msg: "USER NOT FOUND" }]);
            res.redirect("/login")
        }


    } else {
        req.flash("validateError", [{ msg: "TOKEN OR İD NOT FOUND" }]);
        res.redirect("/login")
    }

};

// LOGPUT
const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy((error) => {
            res.clearCookie("connect.sid");
            // req.flash("success_message",[{msg:"ÇIKIŞ YAPILDI"}]);
            res.render('login', { layout: "./layout/authLayout.ejs", successMessage: [{ msg: "LOGOUT İS SUCCESFULY" }] });
            //res.send("çıkış yapıldı")
        })
    });

}

// PROFİLE
const profile = (req, res, next) => {
    res.render("profile", { user: req.user, layout: "./layout/homePagee" });
}
const profilePost = async (req, res, next) => {
    const guncelBilgiler = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        adress: req.body.adress,
        emaill: req.body.emaill
    }
    try {
        if (req.file) {
            guncelBilgiler.avatar = req.file.filename;
        }
        const sonuc = await userModule.findByIdAndUpdate(req.user.id, guncelBilgiler);
        if (sonuc) {
            res.redirect("/profile");
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    loginFormShow, loginFormPost,
    registerFormShow, registerFormPost,
    forgetPasswordFormShow, forgetPasswordFormPost,
    homePage, verifyEmail, verifyEmailPost, logout,
    resetPasswordStep1, resetPasswordStep2, profile, profilePost
}