import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useUserContext } from '../context/userContext';
import style from '../styles/Login.module.css'

function RegisterForm({ changetoLog }) {
    const { register } = useUserContext()
    const [formData, setformdata] = useState({
        username: '',
        email: '',
        password: '',
        image: '',
        aboutme: ''
    });
    const { username, password, email, image, aboutme } = formData;
    const onChange = (e, type) => {
        const value = type === 'image' ? e.target.files[0] : e.target.value
        setformdata((prevData) => ({
            ...prevData,
            [e.target.name]: value
        }))
    }
    const submit = async (e) => {
        e.preventDefault();
        const Data = new FormData
        Data.append("username", username)
        Data.append("email", email)
        Data.append("password", password);
        Data.append("aboutme", aboutme)
        if (image !== '') {
            Data.append("Dp", image)
        }
        register(Data);
    }
    return (

        <form onSubmit={submit}>
            <span className={style.formtitle}>
                Register
            </span>
            <input type="file" name="image" style={{ display: 'none' }} id="Dp" onChange={(e) => onChange(e, 'image')} />
            <div className={style.dpcontainer}>
                <img src={formData.image ? URL.createObjectURL(formData.image) : null} alt="" className={style.dpImg} />
                <label className='' style={{ position: 'absolute' }} htmlFor='Dp'><FiUpload /></label>
            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="text" name="username" value={username} onChange={(e) => onChange(e, 'text')} placeholder='Username' required />
            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="email" name="email" value={email} onChange={(e) => onChange(e, 'text')} placeholder='Email' required />
            </div>
            <div className={style.inputbox}>
                <textarea className={style.input} name='aboutme' maxLength='500' value={aboutme} onChange={(e) => onChange(e, 'text')} placeholder="A little about yourself"></textarea>
            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="password" name="password" value={password} onChange={(e) => onChange(e, 'text')} placeholder="Password" required />
            </div>
            <div className={style.btnbox}>
                <button type='submit' className='button28'><span style={{ color: '#fff' }}>Sign Up</span></button>
            </div>
            <div className={style.bottomtext}>
                <p className={style.text}> Already an user ? <span onClick={changetoLog}>Log In</span></p>
            </div>
        </form>
    )
}

export default RegisterForm