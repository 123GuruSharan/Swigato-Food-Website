import { ORDER_STEPS, normalizeOrderStatus } from "../../utils/orderStatus";
import "./OrderTimeline.css";

const OrderTimeline = ({ status }) => {
  const current = normalizeOrderStatus(status);
  const activeIndex = Math.max(
    0,
    ORDER_STEPS.findIndex((s) => s === current)
  );

  return (
    <div className="order-timeline" role="list" aria-label="Order progress">
      {ORDER_STEPS.map((step, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div
            key={step}
            className={`order-timeline-step ${done ? "done" : ""} ${active ? "active" : ""}`}
            role="listitem"
          >
            <span className="order-timeline-dot" />
            <span className="order-timeline-label">{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
