import { Routes, Route, Navigate } from "react-router-dom";
import MyFunding from "./components/mainhome/Myfunding";
import MyFundingCompleted from "./components/mainhome/MyFundingCompleted";
import FundingDetail from "./components/mainhome/FundingDetail";
import FundingGuest from './components/mainhome/FundingGuest'
import Mypage from './components/mypage/MypageSetting';
import NicknameSetting from './components/mypage/Nickname';
import AccountSetting from './components/mypage/BankAccount';
import NewFunding from './components/mainhome/NewFunding';
import SupportFunding from './components/mainhome/SupportFunding';
import EnterPage from "./components/enterpage/EnterPage";
import Login from "./components/login/Login"
import Prologue from "./components/enterpage/Prologue";
import Signup1 from "./components/signup/Signup1";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/enterpage" replace />} />

      <Route path="/myfunding" element={<MyFunding />} />
      <Route path="/myfunding/completed" element={<MyFundingCompleted />} />
      <Route path="/funding/:id" element={<FundingDetail />} />
      <Route path="/funding/guest" element={<FundingGuest />} />

      <Route path="/newfunding" element={<NewFunding />} />
      <Route path="/fundings/:fundingId" element={<SupportFunding />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/mypage/nickname" element={<NicknameSetting />} />
      <Route path="/mypage/account" element={<AccountSetting />} />

      <Route path="/enterpage" element={<EnterPage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/prologue" element={<Prologue/>}/>
      <Route path="/signup" element={<Signup1/>}/>
    </Routes>
  );
}

export default App;
