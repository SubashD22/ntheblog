import nextConnect from 'next-connect'
import db from '../../../utils/db';
import { parser } from '../../../utils/middlewares/cloudinaryConfig';
import protect from '../../../utils/middlewares/protect';
import BlogPost from '../../../utils/models/post';
  

const handler = async(req,res)=>{
    if(req.method ==='POST'){
        await db();
    const{title,text,categories,image,imageId,images} = req.body
    if(image){
        try {
            const post = await BlogPost.create({
                title,
                text,
                categories,
                image,
                imageId,
                images,
                author:req.user._id
            });
            
                res.status(200).json(post._id)
    
        } catch (error) {
            res.status(400).send(error.message)
        }
    
    }else{
        try {
            const post = await BlogPost.create({
                title,
                text,
                categories,
                author:req.user._id,
                images
            });
            res.status(200).json(post._id)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    }
    
};

export default protect(handler);