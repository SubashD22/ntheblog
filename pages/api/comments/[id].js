import db from "../../../utils/db"
import User from "../../../utils/models/user";
import BlogPost from "../../../utils/models/post";
import Comment from "../../../utils/models/comments";



const handler = async(req,res)=>{
    if(req.method ==='GET'){
        await db();
    const {id} = req.query
    try {
        const comments = await Comment.find({postId:id}).populate('author','-password');
        if(comments){
            res.status(200).json(comments)
        }
    } catch (error) {
        res.status(400).send(error.message)}
    }
    
}
export default handler