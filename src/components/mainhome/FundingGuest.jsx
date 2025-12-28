import React, { useState, useEffect, useMemo } from "react";
import "../../assets/sass/section/mainhome/fundingdetail.scss";
import download from "../../assets/img/download.svg";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const getBaseURL = () => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "/api" : "https://solserver.store/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const FundingGuest = () => {
  const navigate = useNavigate();
  const { fundingId } = useParams();

  const [open, setOpen] = useState(false);
  const toggleSheet = () => setOpen((v) => !v);

  const [funding, setFunding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchFunding = async () => {
      if (!fundingId) return;

      setLoading(true);
      setErrorMsg("");

      try {
        // ✅ GET /api/v1/fundings/{fundingId}
        const res = await api.get(`/v1/fundings/${fundingId}`);
        // ✅ 응답: { success, code, message, data: { ... } }
        setFunding(res?.data?.data ?? null);
      } catch (e) {
        const status = e?.response?.status;
        const msg =
          e?.response?.data?.message ||
          (status ? `요청 실패 (status: ${status})` : "요청 실패");
        setErrorMsg(msg);
        setFunding(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFunding();
  }, [fundingId]);

  const view = useMemo(() => {
    const f = funding || {};

    // achievementRate: 0 또는 48 또는 0.48 등 케이스 대비
    const rawRate = typeof f.achievementRate === "number" ? f.achievementRate : 0;
    const percent =
      rawRate <= 1 ? clamp(Math.round(rawRate * 100), 0, 100) : clamp(Math.round(rawRate), 0, 100);

    const createdAtText = f.createdAt ? f.createdAt.slice(0, 10).replaceAll("-", ". ") : "";

    const remainingDays = typeof f.remainingDays === "number" ? f.remainingDays : null;
    const ddayText = remainingDays !== null ? `D-${remainingDays}` : "";
    const remainPercent = clamp(100 - percent, 0, 100);

    const contributions = Array.isArray(f.contributions) ? f.contributions : [];

    return {
      title: f.title ?? "펀딩",
      giftImgUrl: f.giftImgUrl ?? "",
      ownerNickname: f.ownerNickname ?? "",
      createdAtText,
      percent,
      remainingAmount: typeof f.remainingAmount === "number" ? f.remainingAmount : 0,
      ddayText,
      remainPercent,
      contributions,
    };
  }, [funding]);

  if (loading) {
    return <div className="container fundingdetail_wrap">로딩중...</div>;
  }

  if (errorMsg) {
    return (
      <div className="container fundingdetail_wrap">
        <p style={{ padding: 16 }}>에러: {errorMsg}</p>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: 16 }}>
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <div className={`container fundingdetail_wrap no-padding ${open ? "is-open" : ""}`}>
      <div className="fd_bg">
        {/* ✅ 서버 이미지 */}
        {view.giftImgUrl ? <img src={view.giftImgUrl} alt="" /> : null}

        <div className="fd_title">
          <h1>{view.title}</h1>
        </div>

        <button className="download_btn" type="button">
          <img src={download} alt="" className="download" />
        </button>
      </div>

      <div className={`fd_sheet ${open ? "open" : ""}`} onClick={toggleSheet}>
        {open && (
          <div className="sheet_content" onClick={(e) => e.stopPropagation()}>
            <div className="fd_toprow">
              <div className="fd_meta">
                <p className="fd_owner">
                  {view.ownerNickname ? `${view.ownerNickname}님의 펀딩` : "펀딩"}
                </p>
                <p className="fd_date">
                  {view.createdAtText ? `펀딩 개설일 : ${view.createdAtText}` : ""}
                </p>
              </div>
              <p className="fd_percent">{view.percent}%</p>
            </div>

            <div className="fd_progress">
              <div className="bar">
                <div className="fill" style={{ width: `${view.percent}%` }} />
              </div>
            </div>

            <div className="fd_summary_box">
              <p>남은 금액 : {view.remainingAmount}원</p>
              <p>{view.ddayText ? `언박싱까지 ${view.ddayText}, ${view.remainPercent}% 남았어요!` : ""}</p>
            </div>

            <p className="fd_section_title">펀딩 내역</p>

            <div className="fd_list">
              {view.contributions.length === 0 ? (
                <p style={{ padding: 12, opacity: 0.7 }}>아직 펀딩 내역이 없어요.</p>
              ) : (
                view.contributions.map((c) => (
                  <div className="fd_item" key={c.id}>
                    <div className="left">
                      <p className="name">{c.guestNickname}</p>
                      <p className="msg">{c.message}</p>
                    </div>
                    <p className="money">{c.amount}원</p>
                  </div>
                ))
              )}
            </div>

            <button
              className="fd_stop_btn"
              type="button"
              onClick={() => navigate(`/supportfunding/${fundingId}`)} // 후원 페이지 라우트 맞춰서
            >
              펀딩하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingGuest;