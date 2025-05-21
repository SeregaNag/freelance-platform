'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import { Box, Button, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTestOrder = async () => {
        setIsCreating(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/test-chat`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не удалось создать тестовый заказ');
            }

            const data = await response.json();
            router.push(data.chatUrl);
        } catch (err) {
            console.error('Error creating test order:', err);
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setIsCreating(false);
        }
    };

    if (!orderId) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 4, 
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Typography variant="h5" align="center">
                            Для начала общения в чате требуется ID заказа
                        </Typography>
                        
                        <Typography variant="body1" align="center" color="text.secondary">
                            Вы можете создать тестовый заказ для проверки функционала чата
                        </Typography>
                        
                        {error && (
                            <Alert severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        )}
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={createTestOrder}
                            disabled={isCreating}
                            sx={{ mt: 2 }}
                        >
                            {isCreating ? <CircularProgress size={24} /> : 'Создать тестовый заказ'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return <ChatWindow orderId={orderId} />;
} 