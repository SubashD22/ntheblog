import db from '../../../utils/db';
import User from '../../../utils/models/user';
import BlogPost from '../../../utils/models/post'

const handler = async (req,res) =>{
    if(req.method ==='GET'){
        await db();
        const {id} = req.query
        try {
         const user=  await User.findById(id).select('-password');
         res.status(200).json(user)
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message)
        }
    }
}
export default handler;