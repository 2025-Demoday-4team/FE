import React, { useState } from 'react';
import '../../assets/sass/section/mainhome/newfunding.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const getBaseURL = () => {
    const host = window.location.hostname; // ✅ 선언
    const isLocal = host === "localhost" || host === "127.0.0.1";
    return isLocal ? "/api" : "http://solserver.store/api";
};

const SupportFunding = () => {
    const navigate = useNavigate();
    const { fundingId } = useParams();

    const [guestNickname, setGuestNickname] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // ✅ false로 시작

    const isValid =
        guestNickname.trim() !== '' &&
        Number(amount) >= 10000 &&
        message.trim() !== '';

    const handleSubmit = async () => {
        if (!isValid || loading) {
            alert('모든 정보를 입력해주세요. (금액은 10,000원 이상부터 가능)');
            return;
        }

        console.log("전송 데이터:", { guestNickname, amount, message });
        setLoading(true);

        try {
            await axios.post(
                `${getBaseURL()}/v1/fundings/${fundingId}/contributions`,
                {
                    guestNickname,
                    amount: Number(amount),
                    message,
                }
            );

            alert("펀딩에 성공하셨습니다! 🎉");

            // ✅ 이전 펀딩 상세 페이지로 이동
            navigate(`/fundings/${fundingId}`);
        } catch (error) {
            console.error("펀딩 실패", error);
            alert("펀딩에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container supportfunding_wrap">
            <div className="header">
                <h1>펀딩하기</h1>
                <p>소중한 사람의 위시리스트 달성을 위해 펀딩해주세요!</p>
            </div>

            <div className="main">
                <div className="box">
                    <h2>펀딩 닉네임 설정</h2>
                    <input
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                        value={guestNickname}
                        onChange={(e) => setGuestNickname(e.target.value)}
                    />
                </div>

                <div className="box" id="box2">
                    <h2>펀딩 금액</h2>
                    <input
                        type="number"
                        placeholder="금액을 입력해주세요."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <p>최소 10000원부터 설정할 수 있어요.</p>
                </div>

                <div className="guset_message">
                    <h2>전달 메시지</h2>
                    <p>전달한 메시지는 펀딩 내역에서 볼 수 있어요.</p>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={isValid ? 'active' : ''}
                >
                    {loading ? "처리중..." : "완료"}
                </button>
            </div>
        </div>
    );
};

export default SupportFunding;
