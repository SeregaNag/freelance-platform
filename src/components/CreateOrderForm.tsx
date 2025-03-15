import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

interface CreateOrderFormProps {
    onClose: () => void;
}

export default function CreateOrderForm({ onClose }: CreateOrderFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Order created:', { title, description, price });
        enqueueSnackbar('Заказ создан', { variant: 'success' });
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