import nextConnect from 'next-connect'
import protect from '../../../utils/middlewares/protect';
import { Dpparser } from '../../../utils/middlewares/cloudinaryConfig';
import db from '../../../utils/db';
import User from '../../../utils/models/user';
const Jwt = require('jsonwebtoken');

const apiRoute = nextConnect({
    onError(error, req, res) {
        console.log(error)
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
      },
      onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      },
});
apiRoute.use(Dpparser.fields([
    {name:'Dp',maxCount:1}
]))
apiRoute.post(async(req,res)=>{
  await db();
  if(req.files.Dp){
    try {
        const updateuser = await User.findByIdAndUpdate(req.user._id,{
            aboutme:req.body.aboutme,
            profilePic:req.files.Dp[0].path,
            picId:req.files.Dp[0].filename, 
        },{new:true});
        console.log(updateuser)
        if(updateuser){
            res.status(200).json({
            _id:updateuser.id,
            username:updateuser.username,
            email:updateuser.email,
            aboutme:updateuser.aboutme,
            profilePic:updateuser.profilePic,
        })}
    } catch (error) {
        res.status(400).send(error.message)
    }
    
}else{
    try {
        const updateuser = await User.findByIdAndUpdate(req.user._id,{ 
            aboutme:req.body.aboutme
        },{new:true});
        if(updateuser){
            res.status(200).json({
                _id:updateuser.id,
                username:updateuser.username,
                email:updateuser.email,
                profilePic:updateuser.profilePic, 
                aboutme:updateuser.aboutme
            })
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
    
}
});
const generateToken = (id)=>{
    return Jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
export default protect(apiRoute);
export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };