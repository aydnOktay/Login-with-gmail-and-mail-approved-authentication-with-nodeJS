const {body} = require("express-validator");

// NEW MEMBER REGISTRATION
const newUserAdd = () =>{

    return [
        body("emaill")
        .trim()
        .isEmail().withMessage("PLEASE ENTER VALİD EMAİL TYPE"),

        body("firstName")
        .trim()
        .isLength({min:3}).withMessage("FIRST NAME MUST BE AT LEAST 3 CHARACTERS")
        .isLength({max:10}).withMessage("FIRST NAME MUST BE UP TO 10 CHARACTERS"),

        body("lastName")
        .trim()
        .isLength({min:3}).withMessage("LAST NAME MUST BE AT LEAST 3 CHARACTERS")
        .isLength({max:10}).withMessage("LAST NAME MUST BE UP TO 10 CHARACTERS"),

        body("adress")
        .isLength({min:3}).withMessage("ADRESS MUST BE AT LEAST 3 CHARACTERS")
        .isLength({max:50}).withMessage("ADRESS MUST BE UP TO 10 CHARACTERS"),

        body("password")
        .trim()
        .isLength({min:3}).withMessage("PASSWORD MUST BE AT LEAST 3 CHARACTERS")
        .isLength({max:50}).withMessage("PASSWORD MUST BE UP TO 50 CHARACTERS"),

        body("rpassword")
        .trim()
        .custom((value,{req})=>{
            if (value !== req.body.password) {
                throw new Error("PASSWORDS DO NOT MATCH")      
            }
            return true;
        })

        
    ]

};

// USER LOGIN
const loginUser = () =>{

    return [
        body("emaill")
        .trim()
        .isEmail().withMessage("PLEASE ENTER VALİD EMAİL TYPE"),

        body("password")
        .trim()
        .isLength({min:3}).withMessage("PASSWORD MUST BE AT LEAST 3 CHARACTERS")
        .isLength({max:50}).withMessage("PASSWORD MUST BE UP TO 10 CHARACTERS")
    ]

};

const validateEmail = ()=>{ 
    return [
        body("emaill")
        .trim()
        .isEmail().withMessage("ENTER VALID EMAIL")
    ]
}

const validateNewPassword = ()=>{ 
    return [
        body("password")
        .trim()
        .isLength({min:3}).withMessage("PASSWORD MUST HAVE AT LEAST 3 CHARACTERS")
        .isLength({max:10}).withMessage("PASSWORD MUST HAVE MAXIMUM 10 CHARACTERS"),

        body("rpassword")
        .trim()
        .custom((value,{req})=>{
            if (value !== req.body.password) {
                throw new Error("PASSWORDS ARE NOT THE SAME")      
            }
            return true;
        })

        
    ]
}

module.exports={
    newUserAdd,loginUser,
    validateEmail,validateNewPassword
}