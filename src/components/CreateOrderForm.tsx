import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

export default function CreateOrderForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Order created');
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
            <Button variant="contained">Создать заказ</Button>
        </Box>
    )
}