import { useSelector, useDispatch } from "react-redux";
import { ChatState } from "../types/message";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Badge, Alert, Snackbar } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useSocket from "@/hooks/useSocket";
import { markMessagesAsRead } from "@/features/chatSlice";
import { Message } from "./Message";
import { RootState } from "@/store/store";
import LockIcon from '@mui/icons-material/Lock';
import { useRouter } from "next/navigation";

interface ChatWindowProps {
    orderId: string;
}

export default function ChatWindow({ orderId }: ChatWindowProps) {
    const { messages, isConnected } = useSelector((state: RootState) => state.chat);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreatingTest, setIsCreatingTest] = useState(false);
    const { sendSocketMessage, error: socketError } = useSocket(orderId);
    const dispatch = useDispatch();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (socketError) {
            setError(socketError);
        }
    }, [socketError]);

    useEffect(() => {
        if (messages && messages.length > 0) {
            dispatch(markMessagesAsRead());
        }
    }, [dispatch]);

    useEffect(() => {
        if (messagesEndRef.current && messages && messages.length > 0) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages?.length]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        if (!isConnected) {
            setError('Нет соединения с сервером. Пожалуйста, проверьте подключение.');
            return;
        }

        setIsSending(true);
        setError(null);
        
        try {
            await sendSocketMessage(message);
            setMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err instanceof Error ? err.message : 'Ошибка при отправке сообщения');
        } finally {
            setIsSending(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    const createTestOrder = async () => {
        setIsCreatingTest(true);
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
            setIsCreatingTest(false);
        }
    };

    // Проверка на ошибку доступа к заказу
    if (socketError && socketError.includes('Unauthorized')) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <LockIcon fontSize="large" color="error" />
                <Typography variant="h6" align="center" color="error">
                    У вас нет доступа к этому чату
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                    Вы должны быть участником заказа для доступа к чату
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={createTestOrder}
                    disabled={isCreatingTest}
                    sx={{ mt: 2 }}
                >
                    {isCreatingTest ? <CircularProgress size={24} /> : 'Создать тестовый заказ'}
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Chat</Typography>
                <Badge 
                    badgeContent={isConnected ? "✓" : "✗"} 
                    color={isConnected ? "success" : "error"}
                    sx={{ ml: 2 }}
                >
                    <Typography variant="body2">Status</Typography>
                </Badge>
            </Box>
            
            <Paper sx={{ flexGrow: 1, mb: 2, overflow: 'auto', p: 2, maxHeight: '400px' }}>
                {!messages || messages.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        Сообщений пока нет. Начните общение!
                    </Typography>
                ) : (
                    messages.map((msg) => (
                        <Message key={msg.id} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    disabled={!isConnected || isSending}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    error={!isConnected}
                    helperText={!isConnected ? "Нет соединения с сервером" : ""}
                />
                <Button 
                    variant="contained" 
                    onClick={handleSendMessage}
                    disabled={!isConnected || !message.trim() || isSending}
                >
                    {isSending ? <CircularProgress size={24} /> : 'Send'}
                </Button>
            </Box>

            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={handleCloseError}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}