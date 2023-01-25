import axios from 'axios';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { useUserContext } from '../context/userContext';
import PostCard from './PostCard';
import { FiEdit3 } from 'react-icons/fi'
import { FiCheck } from 'react-icons/fi'
import { FiX } from 'react-icons/fi'
import { motion } from 'framer-motion';
import cloudinary from 'cloudinary/lib/cloudinary';
import { toast } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET
})
const fetchPosts = (id) => {
    return axios.get(`/api/user/posts/${id}`)
}


const ProfileInfo = ({ userInfo }) => {
    const { user, updateInfo, updateImage } = useUserContext();
    const { picId } = user
    const [iloading, setIloading] = useState(false);
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
        console.log(data)
        await updateInfo(data);
        closeInput(type);
    }
    const onfileChange = async (e) => {
        setIloading(true)
        const file = e.target.files[0]
        if (!file) {
            setIloading(false)
            return
        }
        if (picId && picId !== '') {
            const delImage = await cloudinary.v2.uploader.destroy(picId);
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_DPRESET);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData);
        updateImage(res.data.url, res.data.public_id);
        setIloading(false)
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
                                {iloading ? <RotatingLines
                                    strokeColor="black"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="70"
                                    visible={true}
                                /> : <><img src={userInfo?.profilePic} alt="..." width="130" class="rounded mb-2 img-thumbnail" />
                                    <input type="file" className="image-input" id="dp" onChange={onfileChange} />
                                    {user?._id === userInfo?._id ? <label className='image-edit' htmlFor='dp'><FiEdit3 style={{ display: 'inline', cursor: 'pointer' }} /></label> : <></>}</>}

                            </div>
                            <div class="media-body mb-5 text-white">
                                {usernameEdit ? <><input type='text' name='username' value={username} onChange={onInputChange} autocomplete="off" />
                                    <div className='editInfo'><FiX style={{ cursor: 'pointer' }} onClick={() => closeInput('username')} /><FiCheck style={{ cursor: 'pointer' }} onClick={() => callupdate({ username }, "username")} /></div>
                                </> :
                                    <h4 class="mt-0 mb-0">{userInfo?.username} {user?._id === userInfo?._id ? <FiEdit3 style={{ display: 'inline', cursor: 'pointer' }} onClick={() => openInput(username)} /> : <></>} </h4>}
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
                        <h5 class="mb-0 .h5">About {aboutEdit ? <div className='editInfo'><FiX style={{ cursor: 'pointer' }} onClick={() => closeInput('aboutme')} /><FiCheck style={{ cursor: 'pointer' }} onClick={() => callupdate({ aboutme }, "aboutme")} /></div> :
                            <>{user?._id === userInfo?._id ? <FiEdit3 style={{ display: 'inline', cursor: 'pointer' }} onClick={openAboutInput} /> : <></>}</>}
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