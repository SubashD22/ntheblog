import db from "../../../../utils/db";
import User from "../../../../utils/models/user";


const handler = async (req,res) =>{
    if(req.method ==='GET'){
        await db();
        const {username} = req.query
        try {
         const user=  await User.find({username:username}).select('username');
         res.status(200).json(user)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}
export default handler;