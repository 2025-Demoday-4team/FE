import React from 'react'
import "../../assets/sass/section/enterpage/enterpage.scss"
import Logo from "../../assets/img/enterpage/CLEAR.png"
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const EnterPage = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    },2000);

    return () => clearTimeout(timer);
  },[navigate]);

  return (
    <div className='container enterpage'>
      <img className="logo" src={Logo} alt="" />
      <p className="title">너의 위시리스트를 선명하게</p>
    </div>
  )
}

export default EnterPage
