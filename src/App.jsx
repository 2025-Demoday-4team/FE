import { Routes, Route } from "react-router-dom";
import MyFunding from "./components/mainhome/MyFunding";

function App() {
  return (
    <Routes>
      <Route path="/myfunding" element={<MyFunding />} />
    </Routes>
  );
}

export default App;
