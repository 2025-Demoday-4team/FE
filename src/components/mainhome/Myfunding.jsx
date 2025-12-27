import React, { useEffect, useMemo, useState } from "react";
import Nav from "../Nav";
import "../../assets/sass/section/mainhome/myfunding.scss";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const getBaseURL = () => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "/api" : "http://solserver.store/api";
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
        const data = root?.data?.data ?? root?.data ?? [];
        const list = Array.isArray(data) ? data : [];
        setItems(list);
      } catch (e) {
        console.log("🔥 myfunding error", e);
        console.log("status:", e?.response?.status);
        console.log("data:", e?.response?.data);
        console.log("url:", e?.config?.baseURL + e?.config?.url);
        console.log("params:", e?.config?.params);
        setItems([]);
      }
    };

    fetchMyFundings();
  }, [location.key]);

  const mapped = useMemo(() => {
    return items.map((f) => {
      const rawRate = typeof f.achievementRate === "number" ? f.achievementRate : 0;
      const percent =
        rawRate <= 1 ? clamp(Math.round(rawRate * 100), 0, 100) : clamp(Math.round(rawRate), 0, 100);

      const remainingDays = typeof f.remainingDays === "number" ? f.remainingDays : null;
      const dday = remainingDays !== null ? `D-${remainingDays}` : "";

      const remainingAmount = typeof f.remainingAmount === "number" ? f.remainingAmount : 0;

      return {
        id: f.id,
        title: f.title || "펀딩",
        percent,
        dday,
        remainingAmount,
      };
    });
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
          <div key={item.id} className="mf_product" onClick={() => navigate(`/funding/${item.id}`)}>
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

            <p className="mf_remaining_amount">남은 금액 : {item.remainingAmount}원</p>
          </div>
        ))}
      </div>

      <Nav />
    </div>
  );
};

export default MyFunding;