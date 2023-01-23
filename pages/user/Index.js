import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../context/userContext'
const ProfileInfo = dynamic(() => import('../../components/ProfileInfo'), {
  ssr: false
})

const index = () => {
    const {user} = useUserContext();
    const router = useRouter();
    useEffect(() => {
        if(!user){
          router.push('/login')
        }
    }, [user]);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
      setHydrated(true);
    }, []);
    if (!hydrated) {
      return null;
    }
  return (
    <div className='s-content'>
      <ProfileInfo userInfo ={user}/>
    </div>
    
  )
}

export default index