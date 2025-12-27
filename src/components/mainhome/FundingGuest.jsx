import React, { useState, useEffect } from "react";
import "../../assets/sass/section/mainhome/fundingdetail.scss";
import fd_img from "../../assets/img/fundingdetail.png";
import download from "../../assets/img/download.svg";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const getBaseURL = () => {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  // 로컬에서는 vite proxy(/api) 쓰고, 배포에선 서버 직접 호출
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

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));


const FundingGuest = () => {
  const [open, setOpen] = useState(false);
  
      const toggleSheet = () => setOpen((v) => !v);
  
      return (
          <div className={`container fundingdetail_wrap no-padding ${open ? "is-open" : ""}`}>
              <div className="fd_bg">
                  <img src={fd_img} alt="" />
                  <div className="fd_title">
                      <h1>닌텐도 스위치 사조</h1>
                  </div>
                  <button className="download_btn">
                      <img src={download} alt="" className="download" />
                  </button>
              </div>
              <div className={`fd_sheet ${open ? "open" : ""}`} onClick={toggleSheet}>
                  {open && (
                      <div className="sheet_content" onClick={(e) => e.stopPropagation()}>
                          <div className="fd_toprow">
                              <div className="fd_meta">
                                  <p className="fd_owner">안경소녀님의 펀딩</p>
                                  <p className="fd_date">펀딩 개설일 : 2025. 05. 05</p>
                              </div>
                              <p className="fd_percent">48%</p>
                          </div>
                          <div className="fd_progress">
                              <div className="bar">
                                  <div className="fill" style={{ width: "48%" }} />
                              </div>
                          </div>
                          <div className="fd_summary_box">
                              <p>남은 금액 : 120000원</p>
                              <p>언박싱까지 D-34, 52% 남았어요!</p>
                          </div>
                          <p className="fd_section_title">펀딩 내역</p>
                          <div className="fd_list">
                              <div className="fd_item">
                                  <div className="left">
                                      <p className="name">돼지 잡는 꿀꿀이</p>
                                      <p className="msg">으샤으샤 언제 모이나</p>
                                  </div>
                                  <p className="money">32000원</p>
                              </div>
                              <div className="fd_item">
                                  <div className="left">
                                      <p className="name">김철수</p>
                                      <p className="msg">앞으로도 행복하길 바래!!!!</p>
                                  </div>
                                  <p className="money">10000원</p>
                              </div>
                              <div className="fd_item">
                                  <div className="left">
                                      <p className="name">박소유</p>
                                      <p className="msg">진짜 곧 산다…!!</p>
                                  </div>
                                  <p className="money">15000원</p>
                              </div>
                              <div className="fd_item">
                                  <div className="left">
                                      <p className="name">박소유</p>
                                      <p className="msg">진짜 곧 산다…!!</p>
                                  </div>
                                  <p className="money">15000원</p>
                              </div>
                              <div className="fd_item">
                                  <div className="left">
                                      <p className="name">박소유</p>
                                      <p className="msg">진짜 곧 산다…!!</p>
                                  </div>
                                  <p className="money">15000원</p>
                              </div>
                          </div>
                          <button className="fd_stop_btn" type="button">
                              펀딩하기
                          </button>
                      </div>
                  )}
              </div>
          </div>
      );
  };
  

export default FundingGuest
