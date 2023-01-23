import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import ProfileInfo from '../../components/ProfileInfo'
import { useUserContext } from '../../context/userContext'

const Profile = ({userInfo}) => {
  const router = useRouter()
  const {user} = useUserContext()
  useEffect(()=>{
    if(!user){
        router.push('/login')
    }
    if(user._id === userInfo._id){
        router.push('/user')
    }
  },[userInfo])
  return (
    <div className='s-content'>
      <ProfileInfo userInfo ={userInfo}/>
    </div>
  )
}

export default Profile
export const getServerSideProps = async(ctx)=>{
  const {id} = ctx.params
    let hostname;
    if(process.env.NODE_ENV === 'development'){
      hostname = process.env.NEXT_PUBLIC_DEV_URL
    }else{
      hostname = process.env.NEXT_PUBLIC_PROD_URL
    };
    const {data} = await axios.get(`http://${hostname}/api/user/${id}`);
    return{
        props:{
            userInfo:data
        }
    } 
}