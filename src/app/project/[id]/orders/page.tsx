"use client";

import { useParams } from "next/navigation";
import OrdersGrid from "@/components/orders/OrdersGrid";

export default function ProjectOrdersPage() {
  const { id } = useParams<{ id: string }>();
  return <OrdersGrid key={id} projectId={id} />;
}
