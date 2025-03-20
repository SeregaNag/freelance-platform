import { Container } from "@mui/material";
import OrderCard from "./OrderCard";
import OrderFilter from "./OrderFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import OrderCardList from "./OrderCardList";

export default function OrderList() {
  const filter = useSelector((state: RootState) => state.filters.status);
  return (
    <Container>
      <OrderFilter />

<OrderCardList filter={filter} />
    </Container>
  );
}
