export class CreateOrderDto {
  title: string;
  description: string;
  price: number;
  status?: 'pending' | 'in_progress' | 'completed';
  category?: string;
  deadline?: Date;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  attachments?: string[];
}
