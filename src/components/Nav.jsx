import { NavLink } from "react-router-dom";
import "../assets/sass/section/nav.scss";
import myfundingBlack from "../assets/img/nav/nav_mf_black.svg";
import myfundingRed from "../assets/img/nav/nav_mf_red.svg";
import newfundingBlack from "../assets/img/nav/nav_new_black.svg";
import newfundingRed from "../assets/img/nav/nav_new_red.svg";
import mypageBlack from "../assets/img/nav/nav_mp_black.svg";
import mypageRed from "../assets/img/nav/nav_mp_red.svg";

const Nav = () => {
  return (
    <nav className="nav_wrap">
      <NavLink to="/myfunding" className="nav_item">
        {({ isActive }) => (
          <>
            <img
              src={isActive ? myfundingRed : myfundingBlack}
              alt="나의 펀딩"
              className="nav_icon"
            />
            <p className="nav_p">나의 펀딩</p>
          </>
        )}
      </NavLink>

      <NavLink to="/newfunding" className="nav_item">
        {({ isActive }) => (
          <>
            <img
              src={isActive ? newfundingRed : newfundingBlack}
              alt="새 펀딩"
              className="nav_icon"
            />
            <p className="nav_p">새 펀딩</p>
          </>
        )}
      </NavLink>

      <NavLink to="/mypage" className="nav_item">
        {({ isActive }) => (
          <>
            <img
              src={isActive ? mypageRed : mypageBlack}
              alt="마이페이지"
              className="nav_icon"
            />
            <p className="nav_p">마이페이지</p>
          </>
        )}
      </NavLink>
    </nav>
  );
};

export default Nav;
