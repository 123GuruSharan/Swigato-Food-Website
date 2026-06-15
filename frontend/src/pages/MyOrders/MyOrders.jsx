import { useContext, useEffect, useState, useCallback } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderTimeline from "../../components/OrderTimeline/OrderTimeline";
import { getStatusStyleKey, normalizeOrderStatus } from "../../utils/orderStatus";

const MyOrders = () => {
  const { url } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(
    async (authToken) => {
      setLoading(true);
      try {
        const response = await axios.post(
          url + "/api/order/userorders",
          {},
          { headers: { token: authToken } }
        );
        if (response.data.success) {
          setData(response.data.data || []);
        }
      } catch (error) {
        setData([]);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [url, navigate]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
      return;
    }
    fetchOrders(storedToken);
  }, [url, navigate, fetchOrders]);

  const handleTrack = async (orderId) => {
    const authToken = localStorage.getItem("token");
    setRefreshingId(orderId);
    try {
      await fetchOrders(authToken);
      toast.success("Order status updated");
    } finally {
      setRefreshingId(null);
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="my-orders-loading" aria-busy="true">
          <div className="my-orders-spinner" />
          <p>Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <p className="my-orders-sub">Track delivery progress for each order.</p>
      <div className="container">
        {data.length === 0 ? (
          <p className="my-orders-empty">No orders yet. Start ordering from the menu.</p>
        ) : (
          data.map((order) => {
            const statusLabel = normalizeOrderStatus(order.status);
            const styleKey = getStatusStyleKey(order.status);
            return (
              <div key={order._id} className="my-orders-card">
                <div className="my-orders-order">
                  <img src={assets.parcel_icon} alt="" />
                  <p className="my-orders-items">
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " × " + item.quantity;
                      }
                      return item.name + " × " + item.quantity + ", ";
                    })}
                  </p>
                  <p className="my-orders-amount">₹{Number(order.amount).toFixed(2)}</p>
                  <p className="my-orders-count">{order.items.length} items</p>
                  <p className="my-orders-count">
                    {new Date(order.date).toLocaleString()}
                  </p>
                  <div className="my-orders-status-wrap">
                    <span className={`my-orders-status my-orders-status--${styleKey}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="my-orders-track"
                    disabled={refreshingId === order._id}
                    onClick={() => handleTrack(order._id)}
                  >
                    {refreshingId === order._id ? "Refreshing…" : "Refresh status"}
                  </button>
                </div>
                <OrderTimeline status={order.status} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
