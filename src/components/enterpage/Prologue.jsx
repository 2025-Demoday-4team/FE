import React from 'react'
import "../../assets/sass/section/enterpage/prologue.scss"
import { useNavigate } from 'react-router-dom'

const Prologue = () => {
  const navigate = useNavigate();

  return (
    <div className='container prologue'>
      <div className="top">
        <p>나의 위시리스트를 선물받고 싶다면</p>
        <div className="button_container">
            <button className='signupButton' onClick={() => navigate('/signup')}>
                <p className="title">회원가입하기</p>
                <p className="subtitle">계정을 만들고 위시리스트 펀딩을 만들어요</p>
            </button>
            <button className='loginButton' onClick={() => navigate('/login')}>로그인하기</button>
        </div>
      </div>
      <div className="bottom">
        <p>소중한 사람에게 위시리스트를 선물하고 싶다면</p>
        <div className="button_container2">
            <button>게스트로 시작하기</button>
        </div>
      </div>
    </div>
  )
}

export default Prologue
