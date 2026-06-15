import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  const {token, admin, setAdmin, setToken } = useContext(StoreContext);
  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully")
    navigate("/");
  }
  return (
    <div className="navbar">
      <div className="logo-container" onClick={() => navigate(token && admin ? "/add" : "/")} style={{ cursor: "pointer" }}>
        <h1 className="logo-text" style={{ color: "tomato", fontSize: "30px", fontWeight: "bold", margin: 0, fontFamily: "Outfit, sans-serif" }}>Swigato.</h1>
        <p className="admin-subtitle" style={{ fontSize: "12px", color: "#555", margin: 0, fontWeight: "500", fontFamily: "Outfit, sans-serif" }}>Admin Panel</p>
      </div>
      {token && admin ? (
        <p className="login-conditon" onClick={logout}>Logout</p>
      ) : (
        <p className="login-conditon" onClick={()=>navigate("/")}>Login</p>
      )}
      <img className="profile" src={assets.profile_image} alt="" />
    </div>
  );
};

export default Navbar;
