import { useContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import Success from "./pages/Success/Success";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) setToken(authToken);
  }, [setToken]);

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowLogin(true);
    }
  }, [location.pathname]);
  return (
    <>
      {showLogin ? (
        <LoginPopup
          setShowLogin={(value) => {
            setShowLogin(value);
            if (!value && location.pathname === "/login") {
              navigate("/");
            }
          }}
        />
      ) : (
        <></>
      )}
      <div className="app">
        <ToastContainer />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/success" element={<Success />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
