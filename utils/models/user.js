import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required:[true, "Please add a Username"],
        unique: [true, "Username already exists, try a different one"]
    },
    email: {
        type: String,
        required:[true, "Please add an email"],
        unique: true
    },
    password: {
        type: String,
        required:[true, "Please add a Username"],
    },
    profilePic:{
        type:String,
        default:"https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-720x720.jpg"
    },
    aboutme:{
        type:String,
        default:''
    },
    picId:{
        type:String,
    }
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User',userSchema);
export default User