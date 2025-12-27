import React, { useEffect, useMemo, useState } from "react";
import Nav from "../Nav";
import "../../assets/sass/section/mainhome/myfunding.scss";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const getBaseURL = () => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "/api" : "http://solserver.store/api";
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

const STATUS_LABEL = {
  ENDED_SUCCESS: "펀딩 성공",
  ENDED_STOPPED: "펀딩 중단",
  ENDED_EXPIRED: "기간 만료",
  SETTLED: "정산 완료",
};

const COMPLETED_STATUSES = ["ENDED_SUCCESS", "ENDED_STOPPED", "ENDED_EXPIRED", "SETTLED"];

const toPercent = (rate) => {
  if (typeof rate !== "number") return 0;
  const pct = rate <= 1 ? Math.round(rate * 100) : Math.round(rate);
  return clamp(pct, 0, 100);
};

const pickArray = (root) => {
  const data =
    root?.data?.data ??
    root?.data?.content ??
    root?.data ??
    root?.content ??
    root ??
    [];
  return Array.isArray(data) ? data : [];
};

const MyFundingCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCompleted = async () => {
      const results = await Promise.allSettled(
        COMPLETED_STATUSES.map((status) => api.get("/v1/fundings/my", { params: { status } }))
      );

      const ok = results.filter((r) => r.status === "fulfilled").map((r) => r.value);

      const merged = ok.flatMap((res) => pickArray(res?.data));
      const unique = Array.from(
        new Map(
          merged
            .map((x) => {
              const id = x?.id ?? x?.fundingId ?? x?.funding_id;
              return id != null ? [id, { ...x, id }] : null;
            })
            .filter(Boolean)
        ).values()
      );

      setItems(unique);
    };

    fetchCompleted();
  }, [location.key]);

  const mapped = useMemo(() => {
    return items.map((f) => {
      const id = f.id ?? f.fundingId ?? f.funding_id;
      const title = f.title || "펀딩";
      const status = f.status || "";
      const statusText = STATUS_LABEL[status] || status;

      const percent =
        typeof f.achievementRate === "number"
          ? toPercent(f.achievementRate)
          : typeof f.achievement_rate === "number"
          ? toPercent(f.achievement_rate)
          : 0;

      return { id, title, statusText, percent };
    });
  }, [items]);

  return (
    <div className="container myfunding_wrap">
      <div className="myfunding_header">
        <h1>나의 펀딩</h1>

        <div className="section">
          <button type="button" className="tab" onClick={() => navigate("/myfunding")}>
            <p>진행중인 펀딩</p>
          </button>

          <button type="button" className="tab active" onClick={() => navigate("/myfunding/completed")}>
            <p>종료된 펀딩</p>
            <span className="underline" />
          </button>
        </div>
      </div>

      <div className="mf_content">
        {mapped.map((it) => (
          <div className="mf_product" key={it.id} onClick={() => navigate(`/funding/${it.id}`)}>
            <div className="mf_con">
              <div className="mf_con_left">
                <p>{it.title}</p>
                <p className="date">{it.statusText}</p>
              </div>

              <div className="mf_con_right">
                <p className="percent">{it.percent}%</p>
              </div>
            </div>

            <div className="mf_con_var">
              <div className="mf_con_var_fill" style={{ width: `${it.percent}%` }} />
            </div>
          </div>
        ))}
      </div>

      <Nav />
    </div>
  );
};

export default MyFundingCompleted;
