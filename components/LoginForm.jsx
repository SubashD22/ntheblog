import React, { useState } from 'react'
import { useUserContext } from '../context/userContext';
import style from '../styles/Login.module.css'

function LoginForm({ changetoReg }) {
    const { login } = useUserContext()
    const [formData, setformdata] = useState({
        username: '',
        password: ''
    });
    const { username, password } = formData;
    function onChange(e) {
        setformdata((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }
    const submit = async (e) => {
        e.preventDefault();
        login(formData);
    }
    return (
        <form onSubmit={submit} className={style.form}>
            <span className={style.formtitle}>
                Log In
            </span>
            <div className={style.inputbox}>
                <input className={style.input} type="text" name="username" value={username} onChange={onChange} placeholder='Username' required />
            </div>
            <div className={style.inputbox}>
                <input className={style.input} type="password" name="password" value={password} onChange={onChange} placeholder='Password' required />
            </div>
            <div className={style.btnbox}>
                <button type='submit' className='button28'><span style={{ color: '#fff' }}>Sign in</span></button>
            </div>
            <div className={style.bottomtext}>
                <p className={style.text}> New here ? <span onClick={changetoReg}>Register</span></p>
            </div>
        </form>
    )
}

export default LoginForm