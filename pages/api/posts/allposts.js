import db from '../../../utils/db';
import User from '../../../utils/models/user';
import BlogPost from '../../../utils/models/post'

const handler = async (req,res) =>{
   
        await db();
        try {
           const Posts =  await BlogPost.find({}).populate('author','-password')
           res.status(200).json(Posts)
        } catch (error) {
            res.status(400).send(error.message)
        }
}
export default handler;