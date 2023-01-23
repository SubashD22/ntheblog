import mongoose from "mongoose";
import Comment from './comments'
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const User = mongoose.model('User');

const BlogPostSchema = new Schema ({
    title: {
        type:String,
        required:true
    },
    slug:{
        type: String,
        slug:"title"
    },
    image: String,
    images:{
        type:Array
    },
    imageId: String,
    text: {
        type:String,
    },
    categories:{
        type:[String],
        enum:['hobby','travel','food','music','games','lifestyle','fashion','movies','sports','story']
    },
    author:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},{timestamps:true}
);
BlogPostSchema.post('findOneAndDelete', async function(doc){
    if(doc){
     await Comment.deleteMany({
         _id: {$in: doc.comments}
     })
     const image = await cloudinary.uploader.destroy(doc.imageId);
    if(image.result){
      console.log(image.result)
    }
      doc.images.forEach(async(element) => {
         if(element){
       const images= await cloudinary.uploader.destroy(element);
       if(images.result){
       console.log(images.result)}
     }
    });
   
    }
 });
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost',BlogPostSchema);
export default BlogPost;