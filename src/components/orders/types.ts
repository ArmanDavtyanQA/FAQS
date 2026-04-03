export type OrderStatus = "paid" | "pending" | "canceled";

export type OrderRow = {
  id: string;
  name: string;
  /** Display date string (e.g. ISO YYYY-MM-DD). */
  date: string;
  status: OrderStatus;
  /** e.g. formatted amount or "Visa ·••• 4242" */
  payment: string;
};
