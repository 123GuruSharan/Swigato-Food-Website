import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Requires admin session (token + admin flag in localStorage).
 * Backend still enforces role on /api/order/list and /api/order/status.
 */
const AdminRoute = ({ children }) => {
  const navigate = useNavigate();

  const stored = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAdmin = typeof window !== "undefined" && localStorage.getItem("admin") === "true";

  useEffect(() => {
    if (!stored || !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [stored, isAdmin, navigate]);

  if (!stored || !isAdmin) {
    return null;
  }

  return children;
};

export default AdminRoute;
