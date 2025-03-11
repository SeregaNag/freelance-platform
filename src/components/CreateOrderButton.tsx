import { Button } from "@mui/material";

export default function CreateOrderButton() {
  const handleCreateOrder = () => {
    // Implement the logic to create a new order
    console.log("Order created");
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleCreateOrder}
    >
      Создать заказ
    </Button>
  );
}

