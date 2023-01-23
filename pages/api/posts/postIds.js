import db from '../../../utils/db';
import User from '../../../utils/models/user';
import BlogPost from '../../../utils/models/post'

const handler = async (req,res) =>{
   
        await db();
        try {
           const id =  await BlogPost.find({}).select("_id")
           res.status(200).json(id)
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
}
export default handler;