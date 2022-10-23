const localStrategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModule = require("../models/authModule");
const passport = require("passport");
const bcrypt = require("bcrypt");

const options = {
    usernameField: "emaill",
    passwordField: "password"
}

passport.use(new localStrategy(options, async (emaill, passwordd, done) => {

    try {
        const userFind = await userModule.findOne({ emaill });
        if (!userFind) {
            return done(null, false, { message: "Emaill or password is faild" });
        }
        const userPass = await bcrypt.compare(passwordd, userFind.password);
        if (!userPass) {
            return done(null, false, { message: "Emaill or password is faild" });
        } else {
            if (userFind && userFind.emailActive == false) {
                return done(null, false, { message: "Emaill verify please" });
            } else {
                return done(null, userFind);
            }
        }
    } catch (error) {
        return done(error);
    }

}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true,
    proxy: true
},
    async function (request, accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        const userr = await userModule.findOne({ googleId: profile.id });
        if (userr) {
            return cb(null, userr)
        }

        const newUser = new userModule({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            emailActive: true,
            isAdmin:false,
            avatar:profile.photos[0].value
        });

        await newUser.save();
        cb(null, newUser);

    }
));



passport.serializeUser(function (user, done) { // COOKIE ALSO STORES THIS USER
    done(null, user.id.toString());
});

passport.deserializeUser(function (_id, done) { // RETURN OF THE USER FOUND
    userModule.findById(_id, function (err, user) {
        const yeniUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emaill: user.emaill,
            adress: user.adress,
            password: user.password,
            avatar:user.avatar
        }
        done(err, yeniUser)
    })
});
