import React from 'react'
import arrow from "../../assets/img/arrow.png"
import "../../assets/sass/section/signup/signup1.scss"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BANKS = [
  "KB국민은행",
  "신한은행",
  "토스뱅크",
  "카카오뱅크",
  "기업은행",
  "우리은행"
];

const BANK_CODE_MAP = {
  "KB국민은행":"KB",
  "신한은행":"SHINHAN",
  "토스뱅크":"TOSS",
  "카카오뱅크":"KAKAO",
  "기업은행":"IBK",
  "우리은행":"WOORI"
};

const Signup1 = () => {
  const navigate = useNavigate();
  const [bank, setBank] = useState('');
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [account, setAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const isFormValid =
    email.trim() &&
    password.trim() &&
    passwordConfirm.trim() &&
    !isPasswordMismatch &&
    nickname.trim() &&
    account.trim() &&
    bank.trim();


  const handleSelectBank = (name) => {
    setBank(name);
    setIsBankOpen(false); 
  }

  const handleSubmit = async() => {
    if(!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setServerError("");

  // 백엔드 DTO에 맞추기 
  const payload = {
    email:email.trim(),
    password,
    passwordConfirm,
    nickname:nickname.trim(),
    bank:BANK_CODE_MAP[bank] ?? bank,
    accountNumber : account.trim()
  }

  try{
    const res = await fetch("https://solserver.store/api/v1/auth/signup",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),

    })

    if (!res.ok) {
        // 서버가 message 내려주면 그걸 보여주기
        let msg = "회원가입에 실패했어요.";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }

      // 성공 처리
      alert("회원가입이 완료됐어요!");
      navigate("/login"); // 또는 navigate("/myfunding") 등 원하는 곳
      } catch (err) {
        setServerError(err.message || "오류가 발생했어요.");
      } finally {
        setIsSubmitting(false);
      }
  }
  
  return (
    <div className='container signup'>
      <div className="header">
        <button className='arrow' onClick={() => navigate(-1)}><img src={arrow} alt="" /></button>
      </div>
      <div className="main">
        <div className="text_container">
            <h3>회원가입을 위한 정보를 입력해주세요</h3>
            <p>위시리스트 펀딩을 만들기 위해<br/>꼭 필요한 정보만 수집해요.</p>
        </div>
        <div className="input_container1">
            <input className="inputEmail"  placeholder="이메일을 입력하세요." value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input className='inputPassword1' type="password" placeholder="비밀번호를 입력하세요." value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input className='inputPassword2' type="password" placeholder='비밀번호를 한 번 더 입력하세요.' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
            {isPasswordMismatch && (<p className="password_error">비밀번호가 달라요.</p>)}

        </div>
        <div className="input_container2">
            <input className="inputNickname" value={nickname} onChange={(e) => setNickname(e.target.value)} type="text" placeholder='닉네임을 입력하세요.'/>
            <input className="inputAccount" value={account} onChange={(e) => setAccount(e.target.value)} type="text" placeholder='계좌번호를 입력하세요.'/>
            <div className="bank_select">
              <input
                className="inputBank"
                type="text"
                placeholder='은행을 선택하세요.'
                value={bank}
                readOnly
                onClick={() => setIsBankOpen(prev => !prev)}
              />
              {isBankOpen && (
                <div className="bank_dropdown">
                  {BANKS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      className='bank_option'
                      onClick={() => handleSelectBank(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
      <div className="bottom">
        <button
        disabled={!isFormValid}
        className={isFormValid ? 'active' : 'disabled'}
        onClick={handleSubmit}
       >
        
        완료
        </button>
      </div>
    </div>
  )
}

export default Signup1
