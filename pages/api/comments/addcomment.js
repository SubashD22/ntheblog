import db from "../../../utils/db"
import User from "../../../utils/models/user";
import BlogPost from "../../../utils/models/post";
import Comment from "../../../utils/models/comments";
import protect from "../../../utils/middlewares/protect";
const handler = async(req,res)=>{
    if(req.method ==='POST'){
        const {postId,comment} = req.body;
        await db()
        try {
            const addComment = await Comment.create({
                postId,
                comment,
                author:req.user._id
            }) 
            if(addComment){
               await BlogPost.findByIdAndUpdate(postId,{$push:{'comments':addComment._id}});
               res.status(200).send('comment posted')
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
       
    }
};

export default protect(handler)