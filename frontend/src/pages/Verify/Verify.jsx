import { useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      navigate(`/success?session_id=${sessionId}`);
      return;
    }
    toast.info("Payment flow has been updated. Please checkout again.");
    navigate("/order");
  }, [sessionId, navigate]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
