const multer = require("multer")

const storage = multer.diskStorage({
    destination :(req, file, cb)=>{
        cb(null, "./imguploads")
    },
    filename :(req, file, cb)=>{
        cb(null, `Image - ${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype==`image/jpg`||file.mimetype==`image/jpeg`|| file.mimetype==`image/png`){
        cb(null, true)
    }else{
        cd(null, false)
        return cb(new Error ("Accept only png, jpg and jpeg files"))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig


