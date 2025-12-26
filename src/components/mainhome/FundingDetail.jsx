import React, { useEffect, useMemo, useState } from "react";
import "../../assets/sass/section/mainhome/fundingdetail.scss";
import fd_img from "../../assets/img/fundingdetail.png";
import download from "../../assets/img/download.svg";
import modal from '../../assets/img/modal.svg'

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const FundingDetail = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [progress, setProgress] = useState(48);

  const pct = useMemo(() => clamp(progress, 0, 100), [progress]);
  const isCompleted = pct >= 100;

  const toggleSheet = () => setOpen((v) => !v);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  const handlePrimaryAction = () => {
    if (isCompleted) {
      // TODO: 정산 API 호출
      alert("정산하기 처리");
      return;
    }
    openModal();
  };

  const handleConfirmStop = () => {
    // TODO: 중단 API 호출
    setIsModalOpen(false);
    alert("펀딩 중단 처리");
  };

  return (
    <div className={`container fundingdetail_wrap no-padding ${open ? "is-open" : ""}`}>
      <div className="fd_bg">
        <img src={fd_img} alt="" />

        <div className="fd_title">
          <h1>닌텐도 스위치 사조</h1>
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
                <p className="fd_owner">안경소녀님의 펀딩</p>
                <p className="fd_date">펀딩 개설일 : 2025. 05. 05</p>
              </div>
              <p className="fd_percent">{pct}%</p>
            </div>

            <div className="fd_progress">
              <div className="bar">
                <div className="fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="fd_summary_box">
              <p>남은 금액 : 120000원</p>
              <p>언박싱까지 D-34, {100 - pct}% 남았어요!</p>
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
