'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChatWindow from '@/components/ChatWindow';
import ChatList from '@/components/ChatList';
import { 
    Box, 
    Button, 
    Container, 
    Typography, 
    Paper, 
    CircularProgress, 
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
        searchParams.get('orderId')
    );
    const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(
        searchParams.get('freelancerId')
    );
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Обновляем URL при выборе чата
    useEffect(() => {
        if (selectedOrderId) {
            const newUrl = `/chat?orderId=${selectedOrderId}`;
            window.history.replaceState(null, '', newUrl);
        }
    }, [selectedOrderId]);

    const handleChatSelect = (orderId: string, freelancerId?: string) => {
        setSelectedOrderId(orderId);
        setSelectedFreelancerId(freelancerId || null);

        const params = new URLSearchParams();
        params.set('orderId', orderId);
        if (freelancerId) {
            params.set('freelancerId', freelancerId);
        }
        window.history.replaceState(null, '', `/chat?${params.toString()}`);
    };

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
            setSelectedOrderId(data.orderId || data.chatUrl?.split('orderId=')[1]);
        } catch (err) {
            console.error('Error creating test order:', err);
            setError(err instanceof Error ? err.message : 'Произошла ошибка');
        } finally {
            setIsCreating(false);
        }
    };

    // Мобильная версия - показываем либо список, либо чат
    if (isMobile) {
        if (selectedOrderId) {
            return <ChatWindow orderId={selectedOrderId} />;
        }
        
        return (
            <Container maxWidth="sm" sx={{ mt: 2, mb: 2, height: '100vh' }}>
                <ChatList 
                    selectedChatId={selectedOrderId || undefined}
                    onChatSelect={handleChatSelect}
                />
            </Container>
        );
    }

    // Десктопная версия - двухколоночный макет
    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2 }}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        height: '90vh',
                        display: 'flex',
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}
                >
                    {/* Левая панель - список чатов */}
                    <Box sx={{ width: 380, flexShrink: 0 }}>
                        <ChatList 
                            selectedChatId={selectedOrderId || undefined}
                            onChatSelect={handleChatSelect}
                        />
                    </Box>

                    {/* Правая панель - активный чат */}
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {selectedOrderId ? (
                            <ChatWindow orderId={selectedOrderId} freelancerId={selectedFreelancerId || undefined} />
                        ) : (
                            // Экран приветствия когда чат не выбран
                            <Box 
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    gap: 3,
                                    p: 4
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2
                                    }}
                                >
                                    <ChatIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                                </Box>
                                
                                <Typography variant="h4" fontWeight="600" color="text.primary" align="center">
                                    Добро пожаловать в чат
                                </Typography>
                                
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 400, lineHeight: 1.6 }}>
                                    Выберите чат из списка слева или создайте новый тестовый заказ для начала общения
                                </Typography>
                                
                                {error && (
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 2
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
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
} 