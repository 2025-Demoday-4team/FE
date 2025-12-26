import React from "react";
import Nav from "../Nav";
import "../../assets/sass/section/mainhome/myfunding.scss";
import { useNavigate } from "react-router-dom";

const MyFunding = () => {
  const navigate = useNavigate();
  const percent = 48;

  return (
    <div className="container myfunding_wrap">
      <div className="myfunding_header">
        <h1>나의 펀딩</h1>

        <div className="section">
          <button type="button" className="tab active" onClick={() => navigate("/myfunding")}>
            <p>진행중인 펀딩</p>
            <span className="underline" />
          </button>

          <button
            type="button"
            className="tab"
            onClick={() => navigate("/myfunding/completed")}
          >
            <p>종료된 펀딩</p>
          </button>
        </div>
      </div>

      <div className="mf_content">
        <div
          className="mf_product"
          onClick={() => navigate("/funding/1")}
        >
          <div className="mf_con">
            <div className="mf_con_left">
              <p>닌텐도 스위치 사조</p>
              <p className="date">D-2</p>
            </div>

            <div className="mf_con_right">
              <p className="percent">{percent}%</p>
            </div>
          </div>

          <div className="mf_con_var">
            <div className="mf_con_var_fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="mf_product">
          <div className="mf_con">
            <div className="mf_con_left">
              <p>닌텐도 스위치 사조</p>
              <p className="date">D-2</p>
            </div>

            <div className="mf_con_right">
              <p className="percent">{percent}%</p>
            </div>
          </div>

          <div className="mf_con_var">
            <div className="mf_con_var_fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <Nav />
    </div>
  );
};

export default MyFunding;
