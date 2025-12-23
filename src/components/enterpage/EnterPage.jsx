import React from 'react'
import "../../assets/sass/section/enterpage/enterpage.scss"
import Logo from "../../assets/img/enterpage/CLEAR.png"

const EnterPage = () => {
  return (
    <div className='container enterpage'>
      <img className="logo" src={Logo} alt="" />
      <p className="title">너의 위시리스트를 선명하게</p>
    </div>
  )
}

export default EnterPage
