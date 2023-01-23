import db from "../../utils/db"
import User from "../../utils/models/user";


const handler = async(req,res) =>{
    await db();
    const data = await User.find({})
    res.status(200).json(data);
}

export default handler