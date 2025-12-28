import React, { useEffect, useMemo, useState } from "react";
import "../../assets/sass/section/mainhome/fundingdetail.scss";
import fd_img from "../../assets/img/fundingdetail.png";
import download from "../../assets/img/download.svg";
import modal from "../../assets/img/modal.svg";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const getBaseURL = () => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "/api" : "https://solserver.store/api";
};

const api = axios.create({ baseURL: getBaseURL() });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${day}`;
};

const toPercent = (rate) => {
  if (typeof rate !== "number") return 0;
  const pct = rate <= 1 ? Math.round(rate * 100) : Math.round(rate);
  return clamp(pct, 0, 100);
};

const FundingDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

  const fundingId = params.fundingId ?? params.id;

  const handleShareLink = () => {
    const shareLink = `${window.location.origin}/fundings/${fundingId}`;
    alert("공유 링크: " +shareLink);
  }

  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [funding, setFunding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stopping, setStopping] = useState(false);

  const pct = useMemo(() => (funding ? toPercent(funding.achievementRate) : 0), [funding]);
  const isCompleted = pct >= 100;

  useEffect(() => {
    if (!fundingId) {
      setFunding(null);
      setLoading(false);
      return;
    }

    const fetchFundingDetail = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/v1/fundings/${fundingId}`);
        const root = res?.data;
        const data = root?.data?.data ?? root?.data ?? null;

        if (!root?.success || !data) {
          setFunding(null);
          return;
        }

        setFunding(data);
      } catch (e) {
        setFunding(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFundingDetail();
  }, [fundingId]);

  const stopFunding = async () => {
    if (!fundingId || stopping) return;

    try {
      setStopping(true);

      const res = await api.post(`/v1/fundings/${fundingId}/stop`, {
        reason: "사용자 요청 중단"
      });

      const root = res?.data;
      const ok = root?.success === true || res?.status === 200;

      if (!ok) throw new Error("stop failed");

      setIsModalOpen(false);
      navigate("/myfunding/completed", { replace: true });
    } catch (e) {
      alert("펀딩 중단에 실패했어요.");
    } finally {
      setStopping(false);
    }
  };

  const title = funding?.title || "펀딩 상세";
  const ownerNickname = funding?.ownerNickname || "익명";
  const createdAt = formatDate(funding?.createdAt);

  const remainingAmount =
    typeof funding?.remainingAmount === "number" ? funding.remainingAmount.toLocaleString() : "0";

  const remainingDays = typeof funding?.remainingDays === "number" ? funding.remainingDays : 0;

  const contributions = Array.isArray(funding?.contributions) ? funding.contributions : [];

  const heroImg =
    funding?.giftImgUrl &&
      String(funding.giftImgUrl).trim() !== "" &&
      funding.giftImgUrl !== "string"
      ? funding.giftImgUrl
      : fd_img;

  if (loading) {
    return (
      <div
        className="container fundingdetail_wrap no-padding"
        style={{ background: "#fff", color: "#111", height: "852px" }}
      >
        <div style={{ padding: 20 }}>데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!funding) {
    return (
      <div
        className="container fundingdetail_wrap no-padding"
        style={{ background: "#fff", color: "#111", height: "852px" }}
      >
        <div style={{ padding: 20 }}>
          펀딩 정보를 불러올 수 없습니다.
          <div style={{ marginTop: 10, fontSize: 12 }}>
            콘솔에서 [FundingDetail] params / fundingId / res.data 로그를 확인해줘.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container fundingdetail_wrap no-padding ${open ? "is-open" : ""}`}>
      <div className="fd_bg">
        <img src={heroImg} alt="배경" />

        <div className="fd_title">
          <h1>{title}</h1>
        </div>

        <button className="back_btn" type="button" onClick={() => navigate("/myfunding")}>
          <span className="back_icon" aria-hidden="true">
            ‹
          </span>
        </button>

        <button className="download_btn" type="button" onClick={handleShareLink}>
          <img src={download} alt="down" className="download" />
        </button>
      </div>

      <div className={`fd_sheet ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)}>
        {!open && (
          <div className="sheet_handle" style={{ textAlign: "center", padding: "10px" }}>

          </div>
        )}

        {open && (
          <div className="sheet_content" onClick={(e) => e.stopPropagation()}>
            <div className="fd_toprow">
              <div className="fd_meta">
                <p className="fd_owner">{ownerNickname}님의 펀딩</p>
                <p className="fd_date">펀딩 개설일 : {createdAt}</p>
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
              {contributions.length === 0 ? (
                <p>아직 참여 내역이 없어요.</p>
              ) : (
                contributions.map((c) => (
                  <div className="fd_item" key={c.id}>
                    <div className="left">
                      <p className="name">{c.guestNickname}</p>
                      <p className="msg">{c.message}</p>
                    </div>
                    <p className="money">
                      {typeof c.amount === "number" ? c.amount.toLocaleString() : c.amount}원
                    </p>
                  </div>
                ))
              )}
            </div>

            <button
              className="fd_stop_btn"
              type="button"
              onClick={() => (isCompleted ? alert("정산") : setIsModalOpen(true))}
              disabled={stopping}
            >
              {isCompleted ? "펀딩 정산하기" : "펀딩 중단하기"}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fd_modal_backdrop" onClick={() => (stopping ? null : setIsModalOpen(false))}>
          <div className="fd_modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal_img">
              <img src={modal} alt="modal" />
            </div>
            <p className="fd_modal_text">
              아직 펀딩이 완료되지 않았어요.
              <br />
              그래도 중단하시겠어요?
            </p>
            <button className="fd_modal_btn" type="button" onClick={stopFunding} disabled={stopping}>
              네, 중단할래요.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingDetail;