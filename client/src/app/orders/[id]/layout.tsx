import { Container } from "@mui/material";
import { Suspense } from "react";
import OrderLoading from "./loading";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Suspense fallback={<OrderLoading />}>{children}</Suspense>
    </Container>
  );
}
