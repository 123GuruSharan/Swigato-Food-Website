import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const getUserName = (token) => {
  try {
    if (!token) return "User";
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    
    if (decoded.email) {
      const localPart = decoded.email.split("@")[0];
      const namePart = localPart.replace(/[0-9]+$/, ""); // strip numbers from end of email prefix
      if (namePart) {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
    }
    
    return decoded.name || "User";
  } catch (e) {
    return "User";
  }
};

const getUserInitial = (token) => {
  return getUserName(token).charAt(0).toUpperCase();
};

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate=useNavigate();
  const location = useLocation();

  const logout=()=>{
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully")
    navigate("/");
  }

  const handleNavClick = (anchorId, menuValue) => {
    setMenu(menuValue);
    if (location.pathname !== "/") {
      navigate("/" + anchorId);
    } else {
      const element = document.getElementById(anchorId.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <h1 className="logo-text">Swigato.</h1>

      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#explore-menu"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#explore-menu", "menu");
          }}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#app-download"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#app-download", "mobile-app");
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>
        <a
          href="#footer"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#footer", "contact-us");
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <div className="navbar-profile-avatar">
              {getUserInitial(token)}
            </div>
            <ul className="nav-profile-dropdown">
              <div className="nav-profile-header">
                <p className="welcome-text">Welcome, {getUserName(token)}!</p>
                <p className="sub-text">Manage your account</p>
              </div>
              <hr className="divider" />
              <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr className="divider" />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
