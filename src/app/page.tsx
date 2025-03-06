import { Button, Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Платформа фриланс-заказов
      </Typography>
      <Button variant="contained" color="primary">
        Начать
      </Button>
    </Container>
  );
}
