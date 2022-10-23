const multer = require("multer");
const path = require("path");

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/avatar"));
    },
    filename:(req,file,cb)=>{
        cb(null,req.user.emaill+""+path.extname(file.originalname));
    }
});

const myFileFilter=(req,file,cb)=>{
    if (file.mimetype=="image/jpeg" || file.mimetype=="image/png" || file.mimetype=="image/jpg") {
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const uploadResim= multer({storage:myStorage,fileFilter:myFileFilter});
module.exports=uploadResim;