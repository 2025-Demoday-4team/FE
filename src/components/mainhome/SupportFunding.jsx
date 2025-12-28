import React, { useState } from 'react';
import '../../assets/sass/section/mainhome/newfunding.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const getBaseURL = () => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "/api" : "https://solserver.store/api";
};

const requestPortOnePay = (payParams) => {
  return new Promise((resolve, reject) => {
    const IMP = window.IMP;
    if (!IMP) {
      reject(new Error("포트원(아임포트) SDK가 로드되지 않았습니다. index.html에 스크립트 추가했는지 확인하세요."));
      return;
    }

    IMP.init(import.meta.env.VITE_PORTONE_IMP_CODE);

    IMP.request_pay(payParams, (rsp) => {
      if (rsp?.success) resolve(rsp);
      else reject(new Error(rsp?.error_msg || "결제 실패/취소"));
    });
  });
};

const SupportFunding = () => {
  const navigate = useNavigate();
  const { fundingId } = useParams();

  const [guestNickname, setGuestNickname] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid =
    guestNickname.trim() !== '' &&
    Number(amount) >= 10000 &&
    message.trim() !== '';

  const handleSubmit = async () => {
    if (!isValid || loading) {
      alert('모든 정보를 입력해주세요. (금액은 10,000원 이상부터 가능)');
      return;
    }

    setLoading(true);

    const baseURL = getBaseURL();
    const totalAmount = Number(amount);

    // ✅ merchantUid는 결제 완료(complete)에서 그대로 써야 하니까 여기서 미리 생성
    const merchantUid = `funding_${fundingId}_${Date.now()}`;

    try {
      // ✅ 1) contribution 먼저 생성하고, 응답으로 orderId를 받는다
        const contributionRes = await axios.post(
        `${baseURL}/v1/fundings/${fundingId}/contributions`,
        {
            guestNickname,
            amount: totalAmount,
            message,
            // ⚠️ 백이 orderId를 생성한다면 merchantUid를 보내지 말아야 할 가능성이 큼
            // merchantUid,  <-- 일단 제거 권장
        }
        );

        // ✅ 2) 백 응답에서 orderId 추출 (백 응답 구조에 맞게 1개만 남겨서 쓰면 됨)
        const orderId =
        contributionRes?.data?.orderId ||
        contributionRes?.data?.data?.orderId ||
        contributionRes?.data?.result?.orderId;

        if (!orderId) {
        throw new Error("contributions 응답에 orderId가 없습니다. 백 응답 JSON 확인 필요");
        }

        // ✅ 3) 이 orderId를 merchantUid로 '통일'
        const merchantUid = orderId;

        // ✅ 4) 포트원 결제창
        const payResult = await requestPortOnePay({
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: merchantUid,  // ✅ 백 orderId 사용
        name: "펀딩 후원",
        amount: totalAmount,
        buyer_name: guestNickname,
        m_redirect_url: `${window.location.origin}/supportfunding/${fundingId}?paid=1&merchantUid=${merchantUid}`,
        });

        const impUid = payResult.imp_uid;

        // ✅ 5) complete도 동일 merchantUid로
        await axios.post(`${baseURL}/v1/payments/complete`, {
        impUid,
        merchantUid, // ✅ = orderId
        });


      alert("결제가 완료되어 펀딩에 반영되었습니다! 🎉");
      navigate(`/fundings/${fundingId}`);
    } catch (error) {
      console.error("결제/펀딩 처리 실패", error);
      alert(error?.message || "결제/펀딩 처리 실패");
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
          {loading ? "결제 진행중..." : "완료(결제)"}
        </button>
      </div>
    </div>
  );
};

export default SupportFunding;
