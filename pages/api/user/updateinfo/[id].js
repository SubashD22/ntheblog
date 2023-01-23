import nextConnect from 'next-connect'
import db from '../../../../utils/db';
import { Dpparser } from '../../../../utils/middlewares/cloudinaryConfig';
import protect from '../../../../utils/middlewares/protect';
import User from '../../../../utils/models/user'

const apiRoute = nextConnect({
    onError(error, req, res) {
        console.log(error)
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
      },
      onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      },
})
apiRoute.use(Dpparser.fields([
    {name:'Dp',maxCount:1}
]))
apiRoute.put(async(req,res)=>{
    await db();
    if(req.files.Dp){
        try {
            const updateuser = await User.findByIdAndUpdate(req.user._id,{
                profilePic:req.files.Dp[0].path,
                picId:req.files.Dp[0].filename, 
            },{new:true});
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
    }
    else{
        try {
            const {username,aboutme} = req.body;
            if(username){
                const updateuser = await User.findByIdAndUpdate(req.user._id,{
                username:username
                },{new:true});
                if(updateuser){
                    res.status(200).json({
                    _id:updateuser.id,
                    username:updateuser.username,
                    email:updateuser.email,
                    aboutme:updateuser.aboutme,
                    profilePic:updateuser.profilePic,
                })}
            }
            if(aboutme){
                const updateuser = await User.findByIdAndUpdate(req.user._id,{
                    aboutme:aboutme
                    },{new:true});
                    if(updateuser){
                        res.status(200).json({
                        _id:updateuser.id,
                        username:updateuser.username,
                        email:updateuser.email,
                        aboutme:updateuser.aboutme,
                        profilePic:updateuser.profilePic,
                    })}
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
});

export default protect(apiRoute);
export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };