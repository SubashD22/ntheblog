import db from '../../../../utils/db';
import protect from '../../../../utils/middlewares/protect';
import BlogPost from '../../../../utils/models/post'


const handler = async(req,res)=>{
    if(req.method ==="PUT"){
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
        const{title,text,categories,image,imageId,images} = req.body
        if(image){
            try {
                const post =  await BlogPost.findByIdAndUpdate(id,{
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
                const post = await BlogPost.findByIdAndUpdate(id,{
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
        }}
    }
    
};

export default protect(handler);
