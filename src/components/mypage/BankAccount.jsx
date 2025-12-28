import React, { useState, useEffect } from 'react'
import back from '../../assets/img/arrow.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AccountSetting = () => {
  //화면 이동
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }
  //입력값 제어
  const [isEditing, setIsEditing] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://solserver.store/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` //로그인 토큰
          }
        });
        const userData = response.data.data;
        setAccountNumber(userData.accountNumber);
        setBank(userData.bank);
        setLoading(false);
      }
      catch (error) {
        console.error("유저 데이터 불러오기 실패:", error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [])

  const handleAccountChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setAccountNumber(value);
  };
  const handleBankChange = (e) => {
    setBank(e.target.value);
  };

  const handleSave = async () => {
    if (!accountNumber || !bank) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    try {
      await axios.patch('https://solserver.store/api/v1/users/me/bank-account', {
        bank: bank,
        accountNumber: accountNumber
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` //로그인 토큰
        }
      });
      alert("계좌 정보가 변경되었습니다.");
      setIsEditing(false);
    } catch (error) {
      alert("계좌 정보 변경에 실패했습니다.");
    }
  };
  if (loading) return <div>로딩중...</div>;

  return (
    <div className="container bank_wrap">
      <div className="header">
        <img onClick={goBack} src={back} alt="뒤로가기" />
        <h1>계좌 정보 변경</h1>
      </div>
      <div className="main">
        {isEditing ? (
          <>
            <div className="box1">
              <input
                type="text"
                id='account_num'
                value={accountNumber}
                onChange={handleAccountChange}
                placeholder="계좌번호를 입력하세요 (숫자만)"
              />
            </div>
            <div className="box">
              <label>
                <select id='bank_select' defaultValue="" value={bank} onChange={handleBankChange}>
                  <option value="" disabled>은행을 선택하세요</option>
                  <option value="KB">KB국민은행</option>
                  <option value="SHINHAN">신한은행</option>
                  <option value="TOSS">토스뱅크</option>
                  <option value="KAKAO">카카오뱅크</option>
                  <option value="IBK">기업은행</option>
                  <option value="WOORI">우리은행</option>
                </select>
              </label>
            </div>
            {error && <p className="errorText">{error}</p>}
            <button className={`complete_btn ${isEditing ? "active" : ""}`}
              onClick={handleSave} > 완료</button>
          </>
        ) : (
          <>
            <div className="box1" onClick={() => setIsEditing(true)}>
              <p>{bank}</p>
            </div>
            <div className="box" onClick={handleSave}>
              <p> {accountNumber}</p>
            </div>
            <button className={`complete_btn ${isEditing ? "active" : ""}`}
              onClick={handleSave} > 완료</button>
          </>
        )}

      </div>
    </div >
  )
}

export default AccountSetting
