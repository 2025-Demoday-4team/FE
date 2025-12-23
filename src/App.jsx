import { Routes, Route, Navigate } from "react-router-dom";
import MyFunding from "./components/mainhome/MyFunding";
import MyFundingCompleted from "./components/mainhome/MyFundingCompleted";
import FundingDetail from "./components/mainhome/FundingDetail";
import FundingGuest from './components/mainhome/FundingGuest'
import EnterPage from "./components/enterpage/EnterPage";
import Login from "./components/login/Login"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/myfunding" replace />} />

      <Route path="/myfunding" element={<MyFunding />} />
      <Route path="/myfunding/completed" element={<MyFundingCompleted />} />
      <Route path="/funding/:id" element={<FundingDetail />} />
      <Route path="/funding/guest" element={<FundingGuest />} />
      <Route path="/enterpage" element={<EnterPage/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default App;
