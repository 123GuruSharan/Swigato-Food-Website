/** Canonical order lifecycle for production tracking */
export const ORDER_STATUSES = [
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
  if (ORDER_STATUSES.includes(status)) return status;
  return LEGACY_MAP[status] || status;
}

export function isValidOrderStatus(status) {
  return typeof status === "string" && ORDER_STATUSES.includes(status);
}
