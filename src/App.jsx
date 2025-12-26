import { Routes, Route, Navigate } from "react-router-dom";
import MyFunding from "./components/mainhome/MyFunding";
import MyFundingCompleted from "./components/mainhome/MyFundingCompleted";
import FundingDetail from "./components/mainhome/FundingDetail";
import FundingGuest from './components/mainhome/FundingGuest'
import Mypage from './components/mypage/MypageSetting';
import NicknameSetting from './components/mypage/Nickname';
import AccountSetting from './components/mypage/BankAccount';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mypage" replace />} />

      <Route path="/myfunding" element={<MyFunding />} />
      <Route path="/myfunding/completed" element={<MyFundingCompleted />} />
      <Route path="/funding/:id" element={<FundingDetail />} />
      <Route path="/funding/guest" element={<FundingGuest />} />
    
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/mypage/nickname" element={<NicknameSetting />} />
      <Route path="/mypage/account" element={<AccountSetting />} />
    
    </Routes>
  );
}

export default App;
