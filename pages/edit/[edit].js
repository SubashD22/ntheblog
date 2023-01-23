import axios from 'axios';
import dynamic from 'next/dynamic'

const Edit = dynamic(() => import('../../components/edit'), {
  ssr: false
});
const EditPage = ({post,id}) => <Edit data={post} id={id}/>

export default EditPage
export const getServerSideProps = async(ctx)=>{
  const {edit} = ctx.params
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