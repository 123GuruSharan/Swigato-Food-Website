import { useEffect, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./Success.css";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { url, setCartItems } = useContext(StoreContext);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyOrder = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("[Success] No authentication token found");
          setTimeout(() => window.location.href = "/", 1000);
          return;
        }
        console.log("[Success] Token found, proceeding with verification");

        // Get order data from localStorage
        const stored = localStorage.getItem("orderData");
        if (!stored) {
          console.error("[Success] No order data in localStorage");
          setTimeout(() => window.location.href = "/cart", 1000);
          return;
        }
        console.log("[Success] Order data found in localStorage");

        // Verify session ID from URL
        if (!sessionId) {
          console.error("[Success] No session_id in URL params");
          setTimeout(() => window.location.href = "/cart", 1000);
          return;
        }
        console.log("[Success] Session ID found:", sessionId);

        setVerifying(true);
        const orderData = JSON.parse(stored);
        console.log("[Success] Parsed order data:", orderData);
        console.log("[Success] Backend URL:", url);

        // Call backend to verify order
        console.log("[Success] Calling verification API...");
        const response = await axios.post(
          url + "/api/order/verify",
          {
            sessionId,
            orderData,
          },
          {
            headers: { token },
          }
        );\n
        console.log("[Success] Verification response:", response.data);\n
        if (response.data.success) {
          console.log("[Success] Payment verified successfully!");
          // Clear localStorage
          localStorage.removeItem("orderData");
          console.log("[Success] Cleared orderData from localStorage");
          
          // Clear cart from context
          setCartItems({});
          console.log("[Success] Cleared cart items from context");
          
          // Redirect to My Orders page
          console.log("[Success] Redirecting to /myorders...");
          setTimeout(() => {
            window.location.href = "/myorders";
          }, 500);
        } else {
          console.error("[Success] Verification failed:", response.data.message);
          setError(true);
          setTimeout(() => {
            window.location.href = "/cart";
          }, 2000);
        }
      } catch (error) {
        console.error("[Success] Verification error:", error);
        console.error("[Success] Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        setError(true);
        setTimeout(() => {
          window.location.href = "/cart";
        }, 2000);
      } finally {
        setVerifying(false);
      }
    };

    verifyOrder();
  }, [sessionId, url, setCartItems]);

  return (
    <div className="success-page">
      <div className="success-card">
        {error ? (
          <>
            <h2>Something went wrong</h2>
            <p>Redirecting to cart...</p>
          </>
        ) : (
          <>
            <h2>Payment successful</h2>
            <p>{verifying ? "Confirming your order with the kitchen…" : "Redirecting…"}</p>
            <div className="success-spinner" aria-hidden />
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
