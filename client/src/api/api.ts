import { Order } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createOrder(order: {
  title: string;
  description: string;
  price: number;
}): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Ошибка при создании заказа");
  }

  return response.json();
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`);

  if (!response.ok) {
    throw new Error("Ошибка при загрузке заказов");
  }

  return response.json();
}
