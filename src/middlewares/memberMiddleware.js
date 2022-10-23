const {body} = require("express-validator");

// NEW MEMBER REGISTRATION
const newMemberAdd = () =>{

    return [

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

        
        body("price")
        .isLength({min:3}).withMessage("price MUST BE AT LEAST 3 CHARACTERS")
        .isLength({max:50}).withMessage("price MUST BE UP TO 10 CHARACTERS"),

        
    ]

};






module.exports={
    newMemberAdd
}