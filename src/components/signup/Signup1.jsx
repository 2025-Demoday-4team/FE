import React from 'react'
import arrow from "../../assets/img/arrow.png"
import "../../assets/sass/section/signup/signup1.scss"

const Signup1 = () => {
  return (
    <div className='container signup'>
      <div className="header">
        <button className='arrow'><img src={arrow} alt="" /></button>
      </div>
      <div className="main">
        <div className="text_container">
            <h3>회원가입을 위한 정보를 입력해주세요</h3>
            <p>위시리스트 펀딩을 만들기 위해<br/>꼭 필요한 정보만 수집해요.</p>
        </div>
        <div className="input_container1">
            <input className="inputEmail"  placeholder="이메일을 입력하세요."/>
            <input className='inputPassword1' type="password" placeholder="비밀번호를 입력하세요."/>
            <input className='inputPassword2' type="password" placeholder='비밀번호를 한 번 더 입력하세요.'/>
        </div>
        <div className="input_container2">
            <input className="inputNickname" type="text" placeholder='닉네임을 입력하세요.'/>
            <input className="inputAccount" type="text" placeholder='계좌번호를 입력하세요.'/>
            <input className="inputBank" type="text" placeholder='은행을 선택하세요.'/>
        </div>
      </div>
    </div>
  )
}

export default Signup1
