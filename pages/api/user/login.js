import User from '../../../utils/models/user'
import db from '../../../utils/db';
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const handler = async (req,res) =>{
    const{username,password} = req.body;
    await db();
    const user = await User.findOne({username});
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePic: user.profilePic,
            picId:user.picId,
            aboutme:user.aboutme,
            token: generateToken(user._id),
        })
    }else{
        res.status(400).send('invalid credential');
    }
}
const generateToken = (id)=>{
    return Jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
export default handler