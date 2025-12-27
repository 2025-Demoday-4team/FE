import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "../../assets/sass/section/mainhome/fundingdetail.scss";
import fd_img from "../../assets/img/fundingdetail.png";
import download from "../../assets/img/download.svg";
import modal from "../../assets/img/modal.svg";
import axios from "axios";

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

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const FundingDetail = () => {
  const { fundingId } = useParams();

  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [funding, setFunding] = useState(null);
  const [progress, setProgress] = useState(0);

  const BLUR_PX = 12;

  const pct = useMemo(() => clamp(progress, 0, 100), [progress]);
  const isCompleted = pct >= 100;

  const toggleSheet = () => setOpen((v) => !v);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!fundingId) return;

    const fetchFunding = async () => {
      try {
        const res = await api.get(`/v1/fundings/${fundingId}`);

        const root = res?.data;
        const data = root?.data?.data ?? root?.data ?? root;
        const successFlag = typeof root?.success === "boolean" ? root.success : true;

        if (!successFlag || !data) return;

        setFunding(data);

        let rate = 0;
        if (typeof data.achievementRate === "number") {
          rate = data.achievementRate <= 1 ? Math.round(data.achievementRate * 100) : Math.round(data.achievementRate);
        }
        setProgress(rate);
      } catch (e) {
        setFunding(null);
        setProgress(0);
      }
    };

    fetchFunding();
  }, [fundingId]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  const handlePayout = async () => {
    try {
      const res = await api.post(`/v1/fundings/${fundingId}/payout`);
      if (res.data?.success) alert(res.data?.message || "정산 완료");
      else alert(res.data?.message || "정산 실패");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "정산 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  const handlePrimaryAction = () => {
    if (isCompleted) {
      handlePayout();
      return;
    }
    openModal();
  };

  const handleConfirmStop = async () => {
    try {
      const payload = { reason: "사용자 요청" };
      const res = await api.post(`/v1/fundings/${fundingId}/stop`, payload);
      if (res.data?.success) alert(res.data?.message || "펀딩 중단 완료");
      else alert(res.data?.message || "펀딩 중단 실패");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "펀딩 중단 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setIsModalOpen(false);
    }
  };

  const title = funding?.title || "펀딩";
  const ownerNickname = funding?.ownerNickname || "";
  const createdAt = funding?.createdAt ? String(funding.createdAt).slice(0, 10).replaceAll("-", ". ") : "";

  const remainingAmount = typeof funding?.remainingAmount === "number" ? funding.remainingAmount : 0;
  const remainingDays = typeof funding?.remainingDays === "number" ? funding.remainingDays : 0;

  const contributions = Array.isArray(funding?.contributions) ? funding.contributions : [];

  const heroImg =
    funding?.giftImgUrl ||
    funding?.giftImageUrl ||
    funding?.imageUrl ||
    fd_img;

  return (
    <div className={`container fundingdetail_wrap no-padding ${open ? "is-open" : ""}`}>
      <div className="fd_bg">
        <img
          src={heroImg}
          alt=""
          style={{
            filter: `blur(${BLUR_PX}px)`,
            transform: "scale(1.05)",
          }}
        />

        <div className="fd_title">
          <h1>{title}</h1>
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
                <p className="fd_owner">{ownerNickname ? `${ownerNickname}님의 펀딩` : "펀딩"}</p>
                <p className="fd_date">{createdAt ? `펀딩 개설일 : ${createdAt}` : ""}</p>
              </div>
              <p className="fd_percent">{pct}%</p>
            </div>

            <div className="fd_progress">
              <div className="bar">
                <div className="fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="fd_summary_box">
              <p>남은 금액 : {remainingAmount}원</p>
              <p>
                언박싱까지 D-{remainingDays}, {Math.max(0, 100 - pct)}% 남았어요!
              </p>
            </div>

            <p className="fd_section_title">펀딩 내역</p>

            <div className="fd_list">
              {contributions.map((c) => (
                <div className="fd_item" key={c.id}>
                  <div className="left">
                    <p className="name">{c.guestNickname}</p>
                    <p className="msg">{c.message}</p>
                  </div>
                  <p className="money">{c.amount}원</p>
                </div>
              ))}
            </div>

            <button className="fd_stop_btn" type="button" onClick={handlePrimaryAction}>
              {isCompleted ? "펀딩 정산하기" : "펀딩 중단하기"}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fd_modal_backdrop" onClick={closeModal}>
          <div className="fd_modal" onClick={(e) => e.stopPropagation()}>
            <div className="fd_modal_icon" />
            <div className="modal_img">
              <img src={modal} alt="" />
            </div>
            <p className="fd_modal_text">
              아직 펀딩이 완료되지 않았어요.
              <br />
              그래도 펀딩을 중단하시겠어요?
            </p>

            <button className="fd_modal_btn" type="button" onClick={handleConfirmStop}>
              네, 펀딩을 중단할래요.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingDetail;



