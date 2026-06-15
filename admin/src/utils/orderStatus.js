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
  return LEGACY_MAP[status] || "Pending";
}
