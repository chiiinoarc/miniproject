import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Landing from "./Pages/Landing"
import Login from "./Pages/Login"
import CustomerDashboard from "./Pages/CustomerDashboard";
import AdminDashboard from "./Pages/AdminDashboard";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/CustomerDashboard" element={<CustomerDashboard/>} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}
export default App