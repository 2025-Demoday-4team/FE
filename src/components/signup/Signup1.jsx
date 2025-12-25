import React from 'react'
import arrow from "../../assets/img/arrow.png"
import "../../assets/sass/section/signup/signup1.scss"
import { useState } from 'react';

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
  const [bank, setBank] = useState('');
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [account, setAccount] = useState('');

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const isFormValid =
    email &&
    password &&
    passwordConfirm &&
    !isPasswordMismatch &&
    nickname &&
    account &&
    bank;


  const handleSelectBank = (name) => {
    setBank(name);
    setIsBankOpen(false); 
  }
  
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
       >
        완료
        </button>
      </div>
    </div>
  )
}

export default Signup1
