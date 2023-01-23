import db from '../../../../utils/db';
import protect from '../../../../utils/middlewares/protect';
import BlogPost from '../../../../utils/models/post';

const handler = async(req,res)=>{
    if(req.method === "DELETE"){
        const {id} = req.query;
        await db()
        const searchPost = await BlogPost.findById(id);
      if(!searchPost){
        res.send(400).send('post not found')
       };
       if(!req.user){
        res.status(401).send("user not found");
       };
       if(searchPost.author.toString() !== req.user.id){
        res.status(401).send('not authorised to Delete this post')
      }
      if(searchPost.author.toString() === req.user.id){
        try {
            const post =  await BlogPost.findByIdAndDelete(id);
            console.log(post)
            res.status(200).send('deleted')
    
        } catch (error) {
            res.status(400).send(error.message)
        }
      }
    }
};

export default protect(handler)