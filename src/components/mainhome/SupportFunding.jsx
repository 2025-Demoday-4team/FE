import React, { useState } from 'react'
import '../../assets/sass/section/mainhome/newfunding.scss'

const SupportFunding = () => {
    const [guestNickname, setgusetNickname] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const isValid = guestNickname.trim() !== '' && amount >= 10000 && message.trim() !== '';

    const handleSubmit = async () => {
        if (!isValid) {
            alert('모든 정보를 입력해주세요. (금액은 10,000원 이상부터 가능)');
            return;
        }
        console.log("전송 데이터:", { guestNickname, amount, message });
        alert("펀딩에 성공하셨습니다. (테스트 모드)");
        /*
        try {
            await axios.post('여기에 api주소 넣기!!', {
                guestNickname: guestNickname,
                amount: amount,
                message: message
            });
            alert("펀딩에 성공하셨습니다.");
        } catch (error) {
            alert("펀딩에 실패했습니다.");
        }
            */
    };
    /*if (loading) return <div>로딩중...</div>;*/

    return (
        <div className="container supportfunding_wrap">
            <div className="header">
                <h1>펀딩하기</h1>
                <p>소중한 사람의 위시리스트 달성을 위해 펀딩해주세요!</p>
            </div>
            <div className="main">
                <div className="box">
                    <h2>펀딩 닉네임 설정</h2>
                    <input type="text" placeholder="닉네임을 입력해주세요." value={guestNickname} onChange={(e) => setgusetNickname(e.target.value)} />
                </div>
                <div className="box" id='box2'>
                    <h2>펀딩 금액</h2>
                    <input type="number" placeholder="금액을 입력해주세요." value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <p>최소 10000원부터 설정할 수 있어요.</p>
                </div>
                <div className="guset_message">
                    <h2>전달 메시지</h2>
                    <p>전달한 메시지는 펀딩 내역에서 볼 수 있어요.</p>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <button onClick={handleSubmit} className={isValid ? 'active' : ''}>완료</button>
            </div>
        </div>
    )
}

export default SupportFunding
