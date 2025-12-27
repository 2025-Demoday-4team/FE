import React, { useState,useEffect } from 'react'
import Nav from '../Nav'
import '../../assets/sass/section/mypage/mypage.scss'
import { useNavigate } from 'react-router-dom'
import '../../assets/sass/section/mypage/toggle.scss'
import axios from 'axios'

const Mypage = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://solserver.store/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` //로그인 토큰
          }
        });
        const userData = response.data.data;
        setBalance(userData.balance);
        setLoading(false);
      }
      catch (error) {
        console.error("잔고 불러오기 실패:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [])

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

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까?")) {
      return;
    }

    try {
      const response = await axios.delete('http://solserver.store/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.status >= 200 && response.status < 300) {
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.removeItem('accessToken');
        navigate('/');
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("탈퇴 오류 발생");
    }
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
        <div className="bank_balance">
          <p id='my_balance'>나의 잔고</p>
          <p id='num'>{loading ? "로딩 중..." : `${Number(balance).toLocaleString()}원`}</p>
        </div>
        <div className="top">
          <p id='p1'>계정 설정</p>
          <p id='p2' onClick={goBankAccount}>계좌 정보 변경</p>
          <p id='p2' onClick={goNickname}>닉네임 변경</p>
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
          <p id='leave' onClick={handleDeleteAccount}>회원 탈퇴</p>
        </div>
      </div>
      <Nav />
    </div>
  )
}

export default Mypage