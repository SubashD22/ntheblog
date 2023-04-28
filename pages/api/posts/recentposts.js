import mongoose from 'mongoose';
import db from '../../../utils/db';
import User from '../../../utils/models/user';
import BlogPost from '../../../utils/models/post'

const handler = async (req,res) =>{
        console.log(req.subdomains)
        await db();
        try {
           const Posts =  await BlogPost.find({}).populate('author','-password').sort({createdAt:-1}).limit(3)
           res.status(200).json(Posts)
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
}
export default handler;
