"use client";

import { Button, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { setStatusFilter } from "@/features/filterSlice";

export default function OrderFilter() {
  const dispatch = useDispatch();

  return (
    <Container>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => dispatch(setStatusFilter("all"))}
      >
        Все
      </Button>
      <Button
        variant="contained"
        sx={{ bgcolor: "customStatus.completed" }}
        onClick={() => dispatch(setStatusFilter("completed"))}
      >
        Выполненные
      </Button>
      <Button
        variant="contained"
        sx={{ bgcolor: "customStatus.pending" }}
        onClick={() => dispatch(setStatusFilter("pending"))}
      >
        В процессе
      </Button>
      <Button
        variant="contained"
        sx={{ bgcolor: "customStatus.canceled" }}
        onClick={() => dispatch(setStatusFilter("cancelled"))}
      >
        Отмененные
      </Button>
    </Container>
  );
}
