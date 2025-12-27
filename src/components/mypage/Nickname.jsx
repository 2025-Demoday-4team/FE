import React, { useState, useEffect } from 'react'
import back from '../../assets/img/arrow.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Nickname = () => {
  //화면 이동
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }

  //입력값 제어
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
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
        setNickname(userData.nickname);
        setLoading(false);
      }
      catch (error) {
        console.error("유저 데이터 불러오기 실패:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [])

  const validateNickname = (value) => {
    const v = value.trim();
    if (!v) return "닉네임을 입력해주세요.";
    if (v.length > 10) return "닉네임은 10자 이내로 입력해주세요.";
    return "";
  }
  const handleChange = (e) => {
    setNickname(e.target.value);
  };
  const handleSave = async () => {
    const msg = validateNickname(nickname);
    setError(msg);
    if (msg) return;

    console.log("백엔드로 보낼 최종 데이터:", nickname);

    try {
      await axios.patch('http://solserver.store/api/v1/users/me/nickname', { nickname: nickname });
      alert("닉네임이 변경되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
    }
  };
  if (loading) return <div>로딩중...</div>;



  return (
    <div className="container nickname_wrap">
      <div className="header">
        <img onClick={goBack} src={back} alt="뒤로가기" />
        <h1>닉네임 설정</h1>
      </div>
      <div className="main">
        {isEditing ? (
          <>
            <div className="box">
              <input type="text" value={nickname} onChange={handleChange} />
            </div>
            {error && <p className="errorText">{error}</p>}
            <button className={`complete_btn ${isEditing ? "active" : ""}`}
              onClick={handleSave} > 완료</button>
          </>
        ) : (
          <>
            <div className="box" onClick={() => setIsEditing(true)}>
              <p>{nickname}</p>
            </div>
            <button className={`complete_btn ${isEditing ? "active" : ""}`}
              onClick={handleSave} > 완료</button>
          </>
        )}
      </div>
    </div >
  );
};

export default Nickname
