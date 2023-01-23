import React, {useState } from 'react'
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import style from '../styles/Login.module.css'

const Login = () => {
	const [formtype, setFormType] = useState('Login')
    const changetoReg = () => {
        setFormType('Register')
    };
    const changetoLog = () => {
        setFormType('Login')
    };
    let changeForm;
    if (formtype === 'Login') {
        changeForm = (<p> New here ? <span onClick={changetoReg}>Register</span></p>)
    } else {
        changeForm = (<p> Already a user ? <span onClick={changetoLog}>Login</span></p>)
    }
  return (
    <div className='s.content'>
      <div className={style.formcontainer}>
      <div className={style.fbody}>
          {formtype === 'Login' ? <LoginForm changetoReg={changetoReg} /> : <RegisterForm changetoLog={changetoLog}/>}
      </div>
      </div>
    </div>
  )
}

export default Login