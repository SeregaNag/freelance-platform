import { Container } from "@mui/material";
import OrderCard from "./OrderCard";
import OrderFilter from "./OrderFilter";

export default function OrderList() {
  return (
    <Container>
      <OrderFilter />
      <OrderCard />
      <OrderCard />
      <OrderCard />
    </Container>
  );
}
