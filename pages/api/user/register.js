import nextConnect from 'next-connect'
import User from '../../../utils/models/user'
import db from '../../../utils/db';
import { Dpparser } from '../../../utils/middlewares/cloudinaryConfig';
const bcrypt = require('bcryptjs');
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
    const{username,email,password,aboutme}=req.body;
    if( !username || !email || !password){
        res.status(400);
        throw new Error("please fill all feilds")
    };
    await db();
    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400).send('email already exist');
    };
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    if(req.files.Dp){
        try {
            const newUser = await User.create({
                username,
                email,
                aboutme,
                profilePic:req.files.Dp[0].path,
                picId:req.files.Dp[0].filename, 
                password:hashedPassword
            });
            if(newUser){
                res.status(201).json({
                 _id:newUser._id,
                 username:newUser.username,
                 email:newUser.email,
                 profilePic: newUser.profilePic,
                 aboutme:newUser.aboutme,
                 token: generateToken(newUser._id), 
                });
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }else{
        try {
            const newUser = await User.create({
                username,
                email,
                aboutme, 
                password:hashedPassword
            });
            if(newUser){
                res.status(201).json({
                 _id:newUser._id,
                 username:newUser.username,
                 email:newUser.email,
                 profilePic: newUser.profilePic,
                 aboutme:newUser.aboutme,
                 token: generateToken(newUser._id), 
                });
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
})

const generateToken = (id)=>{
    return Jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
export default apiRoute;
export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };