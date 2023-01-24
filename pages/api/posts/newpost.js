import nextConnect from 'next-connect'
import db from '../../../utils/db';
import { parser } from '../../../utils/middlewares/cloudinaryConfig';
import protect from '../../../utils/middlewares/protect';
import BlogPost from '../../../utils/models/post';
  
const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
      },
      onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      },
})
apiRoute.use(parser.fields([
    {name:'Image',maxCount:1}
]))
apiRoute.post(async(req,res)=>{
    await db();
    const{Title,Text,Categories:categories} = req.body
    if(req.files.Image){
        try {
            const post = await BlogPost.create({
                title:Title,
                text:Text,
                categories,
                image:req.files.Image[0].path,
                imageId:req.files.Image[0].filename,
                images:req.body.Images,
                author:req.user._id
            });
            
                res.status(200).json(post._id)
    
        } catch (error) {
            res.status(400).send(error.message)
        }
    
    }else{
        try {
            const post = await BlogPost.create({
                title:Title,
                text:Text,
                categories,
                author:req.user._id,
                images:req.body.Images
            });
            res.status(200).json(post._id)
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