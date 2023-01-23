import db from "../../../utils/db"
import User from "../../../utils/models/user";
import BlogPost from "../../../utils/models/post";
import Comment from "../../../utils/models/comments";
import protect from "../../../utils/middlewares/protect";
const handler = async(req,res)=>{
    if(req.method ==='PUT'){
        const {commentId,comment} = req.body;
        await db()
        try {
            const findComment = await Comment.findById(commentId)
            if(findComment.author.toString() === req.user._id.toString()){
                const updateComment = await Comment.findByIdAndUpdate(commentId,{
                    comment:comment,
                }) 
                if(updateComment){
                   res.status(200).send('comment updated')
                } 
            }
            
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message)
        }
       
    }
};

export default protect(handler)