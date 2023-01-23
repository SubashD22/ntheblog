import protect from "../../../utils/middlewares/protect"

const handler = async(req,res) =>{
    res.status(200).json(req.user)
}
export default protect(handler)