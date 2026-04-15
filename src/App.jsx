import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Landing from "./Pages/Landing"
import Login from "./Pages/Login"
import CustomerDashboard from "./Pages/CustomerDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import MenuManagement from "./Pages/MenuManagement";
import CustomerManagement from "./Pages/CustomerManagement";
import PromoManagement from "./Pages/PromoManagement";
import OrderMenu from "./Pages/OrderMenu";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <OrderMenu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/CustomerDashboard" 
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/menu" 
          element={
            <ProtectedRoute requiredRole="admin">
              <MenuManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/customers" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CustomerManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/promos" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PromoManagement />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}
export default App