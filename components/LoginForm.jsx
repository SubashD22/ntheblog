import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';
import { useUserContext } from '../context/userContext';
import style from '../styles/Login.module.css'

function LoginForm({ changetoReg }) {
    const { login } = useUserContext()
    const [loading, setLoading] = useState(false)
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
        setLoading(true)
        try {
            await login(formData);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }

    }
    const demoLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await login({ username: 'Demo', password: 'sub123' });
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={submit} className={style.form}>
            <fieldset style={{ border: 'none' }} disabled={loading}>
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
                    <button type='submit' className='button28'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }} >{
                            loading ? <RotatingLines
                                strokeColor="#fff"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="30"
                                visible={true}
                            /> : <span style={{ color: '#fff' }}>Sign in</span>
                        }</button>
                    <button onClick={demoLogin} className='button28'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }} >{
                            loading ? <RotatingLines
                                strokeColor="#fff"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="30"
                                visible={true}
                            /> : <span style={{ color: '#fff' }}>Sign in as Demo</span>
                        }</button>
                </div>

                <div className={style.bottomtext}>
                    <p className={style.text}> New here ? <span onClick={changetoReg}>Register</span></p>
                </div>
            </fieldset>
        </form>
    )
}
export default LoginForm