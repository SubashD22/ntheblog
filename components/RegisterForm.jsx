import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useUserContext } from '../context/userContext';
import style from '../styles/Login.module.css';
import { RotatingLines } from 'react-loader-spinner'
import cloudinary from 'cloudinary/lib/cloudinary';
import { toast } from 'react-hot-toast';
import axios from 'axios';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET
})

function RegisterForm({ changetoLog }) {
    const { register } = useUserContext()
    const [iloading, setIloading] = useState(false);
    const [loading, setLoading] = useState(false)
    const [formData, setformdata] = useState({
        username: '',
        email: '',
        password: '',
        profilePic: '',
        picId: '',
        aboutme: ''
    });
    const { username, password, email, profilePic, picId, aboutme } = formData;
    const onChange = (e, type) => {
        const value = type === 'image' ? e.target.files[0] : e.target.value
        setformdata((prevData) => ({
            ...prevData,
            [e.target.name]: value
        }))
    }
    const fileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return
        }
        setIloading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_DPRESET)
        if (picId !== '') {
            const delImage = await cloudinary.v2.uploader.destroy(picId);
        }
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData);
            setformdata((prevData) => ({
                ...prevData,
                profilePic: res.data.url,
                picId: res.data.public_id
            }))
            setIloading(false)
        } catch (error) {
            setIloading(false)
            toast.error('image upload failed')
        }
    }
    const submit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            await register(formData);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }

    }
    return (

        <form onSubmit={submit}>
            <span className={style.formtitle}>
                Register
            </span>
            <input type="file" name="image" style={{ display: 'none' }} id="Dp" onChange={fileChange} />
            <div className={style.dpcontainer}>
                {iloading ? <RotatingLines
                    strokeColor="black"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="70"
                    visible={true}
                /> : <>
                    <img src={picId !== '' ? profilePic : null} alt="" className={style.dpImg} />
                    <label className='' style={{ position: 'absolute' }} htmlFor='Dp'><FiUpload /></label>
                </>}

            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="text" name="username" value={username} onChange={onChange} placeholder='Username' required />
            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="email" name="email" value={email} onChange={onChange} placeholder='Email' required />
            </div>
            <div className={style.inputbox}>
                <textarea className={style.input} name='aboutme' maxLength='500' value={aboutme} onChange={onChange} placeholder="A little about yourself"></textarea>
            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            </div>
            <div className={style.btnbox}>
                <button type='submit' className='button28'
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }} >{
                        loading ? <RotatingLines
                            strokeColor="#fff"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="30"
                            visible={true}
                        /> : <span style={{ color: '#fff' }}>Sign Up</span>
                    }</button>
            </div>
            <div className={style.bottomtext}>
                <p className={style.text}> Already an user ? <span onClick={changetoLog}>Log In</span></p>
            </div>
        </form>
    )
}

export default RegisterForm