import React from 'react'
import "../../assets/sass/section/login/login.scss"
import arrow from "../../assets/img/arrow.png"
import Logo from "../../assets/img/login/CLEAR.png"

const Login = () => {
  return (
    <div className='container login'>
      <div className="header">
        <button className='arrow'><img src={arrow} alt="" /></button>
      </div>
      <div className="middle">
        <img className="logo" src={Logo} alt="" />
        <div className="input_container">
            <input type="text"  placeholder='이메일'/>
            <input type="text" placeholder='비밀번호'/>
        </div>
        <div className="button_container">
            <button className='login_button'>로그인</button>
            <button className='signup_button'>회원가입하기</button>
        </div>
      </div>
    </div>
  )
}

export default Login
