export class UpdateOrderDto {
    title?: string;
    description?: string;
    price?: number;
    status?: 'pending' | 'waiting_confirmation' | 'in_progress' | 'completed';
}