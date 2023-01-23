import db from "../../../utils/db";
import User from "../../../utils/models/user";
import BlogPost from "../../../utils/models/post";

const handler = async (req,res) =>{
    if(req.method ==='GET'){
        await db();
        const {query} = req.query
        try {
         const post = await BlogPost.find({title:{$regex:query, $options:"i"}}).select('title')
         const user=  await User.find({username:{$regex:query, $options:"i"}}).select('username profilePic');
         const data = post.concat(user).sort((a,b) => 
         (a.title || a.username > b.title || b.username) ? 1 :
          ((b.title || b.username > a.title || a.username) ? -1 : 0))
         res.status(200).json(data);
         
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    }
}
export default handler;