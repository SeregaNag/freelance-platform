import { Container } from "@mui/material";
import OrderFilter from "./OrderFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import OrderCardList from "./OrderCardList";
import { UserRole } from "@/types/roles";

export default function OrderList({ role }: { role: UserRole }) {
  const filter = useSelector((state: RootState) => state.filters.status);

  return (
    <Container>
      <OrderFilter />
      <OrderCardList filter={filter} role={role} />
    </Container>
  );
}
