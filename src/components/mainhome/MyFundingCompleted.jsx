import React, { useEffect, useMemo, useState } from "react";
import Nav from "../Nav";
import "../../assets/sass/section/mainhome/myfunding.scss";
import { useNavigate } from "react-router-dom";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const STATUS_LABEL = {
  ENDED_SUCCESS: "펀딩 성공",
  ENDED_STOPPED: "펀딩 중단",
  ENDED_EXPIRED: "기간 만료",
  SETTLED: "정산 완료",
};

const COMPLETED_STATUSES = ["ENDED_SUCCESS", "ENDED_STOPPED", "ENDED_EXPIRED", "SETTLED"];

const MyFundingCompleted = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCompleted = async () => {
      const results = await Promise.allSettled(
        COMPLETED_STATUSES.map((status) =>
          api.get("/v1/fundings/my", { params: { status } })
        )
      );

      const ok = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      const failed = results
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason);

      if (failed.length) {
        failed.forEach((e) => {
          console.error("status", e?.config?.params?.status);
          console.error("url", e?.config?.url);
          console.error("http", e?.response?.status);
          console.error("headers", e?.response?.headers);
          console.error("data", e?.response?.data);
          console.error("message", e?.message);
        });

      }

      const merged = ok.flatMap((res) => (Array.isArray(res.data?.data) ? res.data.data : []));
      const unique = Array.from(new Map(merged.map((x) => [x.id, x])).values());
      setItems(unique);
    };

    fetchCompleted();
  }, []);

  const mapped = useMemo(() => {
    return items.map((f) => {
      const percent =
        typeof f.achievementRate === "number"
          ? clamp(Math.round(f.achievementRate * 100), 0, 100)
          : 0;

      return {
        id: f.id,
        title: f.title || "펀딩",
        statusText: STATUS_LABEL[f.status] || f.status || "",
        percent,
      };
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
        {mapped.map((it) => (
          <div
            className="mf_product"
            key={it.id}
            onClick={() => navigate(`/funding/${it.id}`)}
          >
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
