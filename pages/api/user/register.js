import nextConnect from 'next-connect'
import User from '../../../utils/models/user'
import db from '../../../utils/db';
import { Dpparser } from '../../../utils/middlewares/cloudinaryConfig';
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const handler = async(req,res)=>{
    if(req.method === 'POST'){
        const{username,email,password,aboutme,picId,profilePic}=req.body;
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
    if(picId !== ''){
        try {
            const newUser = await User.create({
                username,
                email,
                aboutme,
                profilePic,
                picId, 
                password:hashedPassword
            });
            if(newUser){
                res.status(201).json({
                 _id:newUser._id,
                 username:newUser.username,
                 email:newUser.email,
                 profilePic: newUser.profilePic,
                 picId:newUser.picId,
                 aboutme:newUser.aboutme,
                 token: generateToken(newUser._id), 
                });
            }
    }catch (error) {
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
                 picId:newUser.picId,
                 aboutme:newUser.aboutme,
                 token: generateToken(newUser._id), 
                });
            }
        }  catch (error) {
            res.status(400).send(error.message)
        }
    }
}}


const generateToken = (id)=>{
    return Jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
export default handler;
