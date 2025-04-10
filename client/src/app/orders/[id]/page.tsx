import OrderDetails from "@/components/OrderDetails";
import { getOrder } from "@/api/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const order = await getOrder(id);
    return {
      title: order.title,
    };
  } catch (error) {
    return {
      title: "Заказ не найден",
    };
  }
}

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  try {
    const order = await getOrder(id);
    return <OrderDetails order={order} />;
  } catch (error) {
    notFound();
  }
}
