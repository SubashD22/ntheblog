import mongoose from "mongoose";
import BlogPost from './post';
const schema = mongoose.Schema;

const commentSchema = new schema(
    {   
        postId: String,
        comment: String,
        author:{
            type:schema.Types.ObjectId,
            ref:'User'
        }
    },{timestamps:true}
);
commentSchema.post('findOneAndDelete', async function(doc){
    if(doc){
     await BlogPost.findByIdAndUpdate(doc.postId,{
         $pull: {comments: doc._id}
     })}
 });
const Comment = mongoose.models.Comment || mongoose.model('Comment',commentSchema);
export default Comment;