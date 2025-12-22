import React from "react";
import Nav from "../Nav";
import "../../assets/sass/section/mainhome/myfunding.scss";
import { useNavigate } from "react-router-dom";

const MyFundingCompleted = () => {
  const navigate = useNavigate();

  const items = [
    { title: "에어팟 프로2", status: "펀딩 성공", percent: 100 },
    { title: "에어팟 프로3", status: "펀딩 중단", percent: 48 },
  ];

  return (
    <div className="container myfunding_wrap">
      <div className="myfunding_header">
        <h1>나의 펀딩</h1>

        <div className="section">
          <button type="button" className="tab" onClick={() => navigate("/myfunding")}>
            <p>진행중인 펀딩</p>
          </button>

          <button
            type="button"
            className="tab active"
            onClick={() => navigate("/myfunding/completed")}
          >
            <p>종료된 펀딩</p>
            <span className="underline" />
          </button>
        </div>
      </div>

      <div className="mf_content">
        {items.map((it, idx) => (
          <div className="mf_product" key={idx}>
            <div className="mf_con">
              <div className="mf_con_left">
                <p>{it.title}</p>
                <p className="date">{it.status}</p>
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
