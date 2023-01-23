import nextConnect from 'next-connect'
import db from '../../../../utils/db';
import { parser } from '../../../../utils/middlewares/cloudinaryConfig';
import protect from '../../../../utils/middlewares/protect';
import BlogPost from '../../../../utils/models/post'

const apiRoute = nextConnect({
    onError(error, req, res) {
        console.log(error)
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
      },
      onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      },
})
apiRoute.use(parser.fields([
    {name:'Image',maxCount:1}
]))
apiRoute.put(async(req,res)=>{
    await db();
    const {id} = req.query
    const searchPost = await BlogPost.findById(id);
    if(!searchPost){
        res.send(400).send('post not found')
    };
    if(!req.user){
        res.status(401).send("user not found");
    }
    if(searchPost.author.toString() !== req.user.id){
       res.status(401).send('not authorised to edit this post')
    }
    if(searchPost.author.toString() === req.user.id){
    const{Title,Text,Categories:categories} = req.body
    if(req.files.Image){
        try {
            const post =  await BlogPost.findByIdAndUpdate(id,{
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
            const post = await BlogPost.findByIdAndUpdate(id,{
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
    }}
});

export default protect(apiRoute);
export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  };