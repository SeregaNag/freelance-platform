import OrderDetails from "@/components/OrderDetails";
import { getOrder } from "@/api/api";

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

  return <OrderDetails order={order} />;
}
