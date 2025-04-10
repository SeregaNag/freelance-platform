export class CreateOrderDto {
  title: string;
  description: string;
  price: number;
  status?: 'pending' | 'in_progress' | 'completed';
}
