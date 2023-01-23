const multer = require('multer');
const{CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:"BlogoftheBored"
    }
});
const Dpstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:"BlogoftheBored/Dp"
    }
});
export const parser = multer({storage:storage});
export const Dpparser = multer({storage:Dpstorage});
export default cloudinary;