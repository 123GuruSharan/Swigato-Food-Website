import React, { useState, useEffect, useContext } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { ORDER_STEPS, normalizeOrderStatus } from "../../utils/orderStatus";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllOrder = async () => {
    const auth = token || localStorage.getItem("token");
    if (!auth) {
      navigate("/");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { token: auth },
      });
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response.data.message || "Could not load orders");
      }
    } catch (e) {
      toast.error("Failed to fetch orders");
      if (e.response?.status === 401 || e.response?.status === 403) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const auth = token || localStorage.getItem("token");
    const nextStatus = event.target.value;
    setUpdatingId(orderId);
    try {
      const response = await axios.post(
        url + "/api/order/status",
        { orderId, status: nextStatus },
        { headers: { token: auth } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const auth = token || localStorage.getItem("token");
    const isAdmin = admin || localStorage.getItem("admin") === "true";
    if (!auth || !isAdmin) {
      toast.error("Please log in as admin");
      navigate("/");
      return;
    }
    fetchAllOrder();
    // Intentionally run once on mount; list is refreshed after status updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="order add orders-loading">
        <div className="orders-spinner" aria-busy="true" />
        <p>Loading orders…</p>
      </div>
    );
  }

  return (
    <div className="order add">
      <div className="orders-header">
        <h3>Orders</h3>
        <p className="orders-subtitle">Update delivery status for each order.</p>
      </div>
      <div className="order-list">
        {orders.length === 0 ? (
          <p className="orders-empty">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " × " + item.quantity;
                    }
                    return item.name + " × " + item.quantity + ", ";
                  })}
                </p>
                <p className="order-item-name">
                  {order.address?.firstName || ""} {order.address?.lastName || ""}
                </p>
                <div className="order-item-address">
                  <p>{order.address?.street || ""}</p>
                  <p>
                    {[order.address?.city, order.address?.state, order.address?.country, order.address?.zipcode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <p className="order-item-phone">{order.address?.phone || ""}</p>
                {order.paymentId && (
                  <p className="order-item-payment-id" title="Payment reference">
                    Payment ID: {order.paymentId}
                  </p>
                )}
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{Number(order.amount).toFixed(2)}</p>
              <div className="order-item-status">
                <label className="sr-only" htmlFor={`status-${order._id}`}>
                  Order status
                </label>
                <select
                  id={`status-${order._id}`}
                  onChange={(e) => statusHandler(e, order._id)}
                  value={normalizeOrderStatus(order.status)}
                  disabled={updatingId === order._id}
                >
                  {ORDER_STEPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {updatingId === order._id && (
                  <span className="order-status-saving">Saving…</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
