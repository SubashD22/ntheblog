import axios from 'axios';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { useUserContext } from '../context/userContext';
import PostCard from './PostCard';
import { FiEdit3 } from 'react-icons/fi'
import { FiCheck } from 'react-icons/fi'
import { FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'
const fetchPosts = (id) => {
    return axios.get(`/api/user/posts/${id}`)
}


const ProfileInfo = ({ userInfo }) => {
    const { user, updateInfo } = useUserContext();
    const [profileInfo, setProfileinfo] = useState({
        username: userInfo?.username,
        aboutme: userInfo?.aboutme,
    });
    const { username, aboutme } = profileInfo;
    const [usernameEdit, setUsernameEdit] = useState(false)
    const [aboutEdit, setAboutEdit] = useState(false)
    const { data: posts, refetch } = useQuery(['posts', userInfo?._id], () => fetchPosts(userInfo?._id), {
        enabled: !!userInfo?._id,
    })
    const Posts = posts?.data;
    const openInput = () => {
        setAboutEdit(false)
        setUsernameEdit(true)
    }
    const openAboutInput = () => {
        setUsernameEdit(false);
        setAboutEdit(true)
    }
    const onInputChange = (e) => {
        setProfileinfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const closeInput = (type) => {
        if (type === 'username') {
            setUsernameEdit(false)
        }
        if (type === 'aboutme') {
            setAboutEdit(false)
        }

    }
    const callupdate = async (data, type) => {
        await updateInfo(data, type);
        closeInput(type);
    }
    const imageChange = async (e, type) => {
        const data = e.target.files[0];
        await updateInfo(data, type)
    }
    return (
        <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                delay: 0.75,
                duration: 0.2,
            }} class=" profile-row py-5 px-4">
            <div class="col-md-5 mx-auto">
                <div class="bg-white shadow rounded overflow-hidden">
                    <div class="px-4 pt-0 pb-4 cover">
                        <div class="media align-items-end profile-head">
                            <div class="profile mr-3">
                                <img src={userInfo?.profilePic} alt="..." width="130" class="rounded mb-2 img-thumbnail" />
                                <input type="file" className="image-input" id="dp" onChange={(e) => imageChange(e, 'Dp')} />
                                {user?._id === userInfo?._id ? <label className='image-edit' htmlFor='dp'><FiEdit3 style={{ display: 'inline' }} /></label> : <></>}
                            </div>
                            <div class="media-body mb-5 text-white">
                                {usernameEdit ? <><input type='text' name='username' value={username} onChange={onInputChange} autocomplete="off" />
                                    <div className='editInfo'><FiX onClick={() => closeInput('username')} /><FiCheck onClick={() => callupdate(username, "username")} /></div>
                                </> :
                                    <h4 class="mt-0 mb-0">{userInfo?.username} {user?._id === userInfo?._id ? <FiEdit3 style={{ display: 'inline' }} onClick={() => openInput(username)} /> : <></>} </h4>}
                                <p class="small mb-4">
                                    <i class="fas fa-map-marker-alt mr-2"></i>{userInfo?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-light p-4 d-flex justify-content-end text-center">
                        <ul class="list-inline mb-0">
                            <li class="list-inline-item">
                                <h5 class="font-weight-bold mb-0 d-block">{Posts?.length}</h5>
                                <small class="text-muted"> <i class="fas fa-image mr-1"></i>Posts</small>
                            </li>
                        </ul>
                    </div>
                    <div class="px-4 py-3">
                        <h5 class="mb-0 .h5">About {aboutEdit ? <div className='editInfo'><FiX onClick={() => closeInput('aboutme')} /><FiCheck onClick={() => callupdate(aboutme, "aboutme")} /></div> :
                            <>{user?._id === userInfo?._id ? <FiEdit3 style={{ display: 'inline' }} onClick={openAboutInput} /> : <></>}</>}
                        </h5>
                        <div class="p-4 rounded shadow-sm bg-light">
                            {aboutEdit ? <textarea name='aboutme' value={aboutme} onChange={onInputChange}></textarea> : <p class="font-italic mb-0">{userInfo?.aboutme}</p>}


                        </div>
                    </div>
                    <div class="py-4 px-4">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <h5 class="mb-0"> Your posts</h5>
                        </div>
                        <div className='archive'>
                            {Posts?.map(p => <PostCard key={p._id} post={p} />)}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ProfileInfo