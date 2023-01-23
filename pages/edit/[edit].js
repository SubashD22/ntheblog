import axios from 'axios';
import dynamic from 'next/dynamic'

const Edit = dynamic(() => import('../../components/edit'), {
  ssr: false
});
const EditPage = ({post,id}) => <Edit data={post} id={id}/>

export default EditPage
export const getStaticPaths=async()=>{
  let hostname;
    if(process.env.NODE_ENV === 'development'){
      hostname = process.env.NEXT_PUBLIC_DEV_URL
    }else{
      hostname = process.env.NEXT_PUBLIC_PROD_URL
    };
  const {data}= await axios.get(`http://${hostname}/api/posts/postIds`);
  const allPaths = data.map(e=>{
      return{
          params :{
              edit:e._id
          }
      }
  })
  return{
      paths:allPaths,
      fallback:false
  }

}
export const getStaticProps = async({params:{edit}})=>{
  let hostname;
    if(process.env.NODE_ENV === 'development'){
      hostname = process.env.NEXT_PUBLIC_DEV_URL
    }else{
      hostname = process.env.NEXT_PUBLIC_PROD_URL
    };
  const {data} = await axios.get(`http://${hostname}/api/posts/${edit}`);
  return{
      props:{
          post:data,
          id:edit
      }
  } 
}