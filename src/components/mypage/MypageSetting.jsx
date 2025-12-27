import React, { useState } from 'react'
import Nav from '../Nav'
import '../../assets/sass/section/mypage/mypage.scss'
import { useNavigate } from 'react-router-dom'
import '../../assets/sass/section/mypage/toggle.scss'


const Mypage = () => {
  const navigate = useNavigate();

  const goBankAccount = () => {
    navigate('./account');
  }
  const goNickname = () => {
    navigate('./nickname');
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  }


  const [isToggled, setIsToggled] = useState(false);
  const handleToggle = () => {
    setIsToggled(!isToggled);
  }


  return (
    <div className="container mypage_wrap">
      <div className="header">
        <h1>마이페이지</h1>
      </div>
      <div className="main">
        <div className="top">
          <p id='p1' onClick={goNickname}>계정 설정</p>
          <p id='p2' onClick={goBankAccount}>계좌 정보 변경</p>
        </div>
        <div className="mid">
          <p id='p1'>앱 설정</p>
          <div className="pushalarm">
            <p id='p2'>푸시알림</p>
            <div className={`toggle_switch ${isToggled ? 'on' : 'off'}`} onClick={handleToggle}>
              <div className="toggle_handle" />
            </div>
          </div>
        </div>
        <div className="bottom">
          <p id='logout' onClick={handleLogout}>로그아웃</p>
          <p id='leave'>회원 탈퇴</p>
        </div>
      </div>
      <Nav />
    </div>
  )
}

export default Mypage
