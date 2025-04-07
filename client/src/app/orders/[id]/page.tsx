"use client";

import { getOrder } from "@/api/api";
import { Order } from "@/types/order";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await getOrder(id as string);
      setOrder(order);
    };
    fetchOrder();
  }, [id]);
  console.log(id);
  return (
    <Box>
      <Typography variant="h1">{order?.title}</Typography>
      <Typography variant="body1">{order?.description}</Typography>
      <Typography variant="body1">{order?.price}</Typography>
    </Box>
  );
}
