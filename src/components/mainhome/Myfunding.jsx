import React, { useEffect, useMemo, useState } from "react";
import Nav from "../Nav";
import "../../assets/sass/section/mainhome/myfunding.scss";
import { useLocation, useNavigate } from "react-router-dom";
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

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const toNumber = (v, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseDateOnly = (isoLike) => {
  if (!isoLike) return null;
  const s = String(isoLike);
  const datePart = s.includes("T") ? s.split("T")[0] : s;
  const d = new Date(`${datePart}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const calcRemainingDaysFromDeadline = (deadlineIso) => {
  const d = parseDateOnly(deadlineIso);
  if (!d) return null;

  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffMs = d.getTime() - t0.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Number.isFinite(days) ? Math.max(0, days) : null;
};

const calcPercent = (f) => {
  const rawRate =
    typeof f.achievementRate === "number"
      ? f.achievementRate
      : typeof f.achievement_rate === "number"
        ? f.achievement_rate
        : null;

  if (rawRate !== null) {
    const pct =
      rawRate <= 1
        ? Math.round(rawRate * 100)
        : Math.round(rawRate);
    return clamp(pct, 0, 100);
  }

  const current = toNumber(f.currentAmount ?? f.current_amount ?? f.raisedAmount ?? f.raised_amount, 0);
  const target = toNumber(f.targetAmount ?? f.target_amount, 0);
  if (target <= 0) return 0;

  return clamp(Math.round((current / target) * 100), 0, 100);
};

const calcRemainingAmount = (f) => {
  const ra =
    typeof f.remainingAmount === "number"
      ? f.remainingAmount
      : typeof f.remaining_amount === "number"
        ? f.remaining_amount
        : null;

  if (ra !== null) return Math.max(0, Math.round(ra));

  const current = toNumber(f.currentAmount ?? f.current_amount ?? f.raisedAmount ?? f.raised_amount, 0);
  const target = toNumber(f.targetAmount ?? f.target_amount, 0);
  return Math.max(0, Math.round(target - current));
};

const calcDday = (f) => {
  const remainingDays =
    typeof f.remainingDays === "number"
      ? f.remainingDays
      : typeof f.remaining_days === "number"
        ? f.remaining_days
        : null;

  if (remainingDays !== null) return `D-${Math.max(0, remainingDays)}`;

  const deadline =
    f.deadlineAt ?? f.deadline_at ?? f.deadline ?? f.endAt ?? f.end_at ?? null;

  const days = calcRemainingDaysFromDeadline(deadline);
  return days === null ? "" : `D-${days}`;
};

const MyFunding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMyFundings = async () => {
      try {
        const res = await api.get("/v1/fundings/my", {
          params: { status: "IN_PROGRESS" },
        });

        const root = res?.data;

        const data =
          root?.data?.data ??
          root?.data?.content ??
          root?.data ??
          root?.content ??
          root ??
          [];
          console.log("서버 데이터:", data);

        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setItems([]);
      }
    };

    fetchMyFundings();
  }, [location.key]);

  const mapped = useMemo(() => {
    return items.map((f) => {
      const id = f.id ?? f.fundingId ?? f.funding_id ?? f.fundId ?? f.fund_id;

      return {
        id,
        title: f.title || "펀딩",
        percent: calcPercent(f),
        dday: calcDday(f),
        remainingAmount: calcRemainingAmount(f),
      };
    }).filter((x) => x.id !== undefined && x.id !== null);
  }, [items]);

  return (
    <div className="container myfunding_wrap">
      <div className="myfunding_header">
        <h1>나의 펀딩</h1>

        <div className="section">
          <button type="button" className="tab active" onClick={() => navigate("/myfunding")}>
            <p>진행중인 펀딩</p>
            <span className="underline" />
          </button>

          <button type="button" className="tab" onClick={() => navigate("/myfunding/completed")}>
            <p>종료된 펀딩</p>
          </button>
        </div>
      </div>

      <div className="mf_content">
        {mapped.map((item) => (
          <div
            key={item.id}
            className="mf_product"
            onClick={() => navigate(`/funding/${item.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/funding/${item.id}`);
            }}
          >
            <div className="mf_con">
              <div className="mf_con_left">
                <p>{item.title}</p>
                <p className="date">{item.dday}</p>
              </div>

              <div className="mf_con_right">
                <p className="percent">{item.percent}%</p>
              </div>
            </div>

            <div className="mf_con_var">
              <div className="mf_con_var_fill" style={{ width: `${item.percent}%` }} />
            </div>

          </div>
        ))}
      </div>

      <Nav />
    </div>
  );
};

export default MyFunding;