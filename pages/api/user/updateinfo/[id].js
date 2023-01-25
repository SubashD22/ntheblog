import nextConnect from 'next-connect'
import db from '../../../../utils/db';
import { Dpparser } from '../../../../utils/middlewares/cloudinaryConfig';
import protect from '../../../../utils/middlewares/protect';
import User from '../../../../utils/models/user'

const handler = async(req,res)=>{
    if(req.method==='PUT'){
        const {username,aboutme,profilePic,picId} = req.body
        try {
            const user = await User.findById(req.user._id);
            console.log(req.body)
            const updateuser = await User.findByIdAndUpdate(req.user._id,{
                profilePic: profilePic || user.profilePic,
                picId: picId || user.picId,
                username: username || user.username, 
                aboutme: aboutme || user.aboutme
            },{new:true});
            if(updateuser){
                res.status(200).json({
                _id:updateuser.id,
                username:updateuser.username,
                email:updateuser.email,
                aboutme:updateuser.aboutme,
                profilePic:updateuser.profilePic,
                picId:updateuser.picId
            })}
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
};

export default protect(handler);