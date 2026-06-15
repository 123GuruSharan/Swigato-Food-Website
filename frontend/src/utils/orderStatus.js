export const ORDER_STEPS = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const LEGACY_MAP = {
  "Food Processing": "Preparing",
  "Order Placed": "Pending",
  "Out for delivery": "Out for Delivery",
};

export function normalizeOrderStatus(status) {
  if (!status || typeof status !== "string") return "Pending";
  if (ORDER_STEPS.includes(status)) return status;
  return LEGACY_MAP[status] || status;
}

/** Tailwind-style semantic keys for CSS */
export function getStatusStyleKey(status) {
  const s = normalizeOrderStatus(status);
  if (s === "Pending") return "pending";
  if (s === "Preparing") return "preparing";
  if (s === "Out for Delivery") return "out";
  if (s === "Delivered") return "delivered";
  return "pending";
}
