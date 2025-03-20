import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { createOrder } from '@/api/api';

interface CreateOrderFormProps {
    onClose: () => void;
}

export default function CreateOrderForm({ onClose }: CreateOrderFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newOrder = await createOrder({ title, description, price });
            enqueueSnackbar(`Заказ "${newOrder.title}" успешно создан`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(`Ошибка при создании заказа ${(error as Error).message}`, { variant: 'error' });
            return
        }
        onClose();
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
        >
            <TextField label="Название заказа"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal" />
            <TextField label="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                margin="normal" />
            <TextField label="Цена" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} fullWidth margin="normal" />
            <Button variant="contained" color="primary" type="submit">Создать </Button>
        </Box>
    )
}