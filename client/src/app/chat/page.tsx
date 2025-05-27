'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import { 
    Box, 
    Button, 
    Container, 
    Typography, 
    Paper, 
    CircularProgress, 
    Alert,
    useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const theme = useTheme();
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
                        p: 6, 
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <Box 
                            sx={{ 
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1
                            }}
                        >
                            <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>
                        
                        <Typography variant="h4" fontWeight="600" color="text.primary">
                            Добро пожаловать в чат
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, lineHeight: 1.6 }}>
                            Для начала общения в чате требуется ID заказа. Вы можете создать тестовый заказ 
                            для проверки функционала или перейти к чату через существующий заказ.
                        </Typography>
                        
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    width: '100%',
                                    borderRadius: 2,
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                        textAlign: 'center'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={createTestOrder}
                                disabled={isCreating}
                                size="large"
                                startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                sx={{ 
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600
                                }}
                            >
                                {isCreating ? 'Создание...' : 'Создать тестовый заказ'}
                            </Button>
                            
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={() => router.push('/orders')}
                                size="large"
                                sx={{ 
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600
                                }}
                            >
                                Перейти к заказам
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return <ChatWindow orderId={orderId} />;
} 