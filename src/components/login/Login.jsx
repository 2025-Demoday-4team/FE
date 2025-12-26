import React from 'react'
import "../../assets/sass/section/login/login.scss"
import arrow from "../../assets/img/arrow.png"
import Logo from "../../assets/img/login/CLEAR.png"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [severError, setServerError] = useState('');

  const isFormValid = email.trim() && password.trim();

  const handleLogin = async() => {
    if(!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setServerError('');

    const payload = {
      email : email.trim(),
      password,
    };

    try{
      const res = await fetch("http://solserver.store/api/v1/auth/login",{
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify(payload),
      });

      let dataText = "";
      try{
        dataText = await res.text();
      } catch {}

      if(!res.ok){
        let msg = "로그인에 실패했어요.";
        try{
          const json = JSON.parse(dataText);
          msg = json?.message||msg;
        } catch{
          if(dataText) msg = dataText;
        } 
        throw new Error(msg);
      }

      navigate("/");
    } catch(err){
      setServerError(err.message || "오류가 발생했어요.")
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className='container login'>
      <div className="header">
        <button className='arrow' onClick={() => navigate(-1)}><img src={arrow} alt="" /></button>
      </div>
      <div className="middle">
        <img className="logo" src={Logo} alt="" />
        <div className="input_container">
            <input type="text"  placeholder='이메일' value = {email} onChange={(e)=> setEmail(e.target.value)}/>
            <input type="text" placeholder='비밀번호' value = {password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="button_container">
            <button className='login_button' disabled={!isFormValid || isSubmitting} onClick={handleLogin}>로그인</button>
            <button className='signup_button' onClick={() => navigate('/signup')}>회원가입하기</button>
        </div>
      </div>
    </div>
  )
}

export default Login
