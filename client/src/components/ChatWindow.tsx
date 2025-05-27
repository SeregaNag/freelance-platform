import { useSelector, useDispatch } from "react-redux";
import { ChatState } from "../types/message";
import { 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Paper, 
    CircularProgress, 
    Badge, 
    Alert, 
    Snackbar,
    Container,
    Divider,
    IconButton,
    useTheme
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useSocket from "@/hooks/useSocket";
import { markMessagesAsRead } from "@/features/chatSlice";
import { Message } from "./Message";
import { RootState } from "@/store/store";

import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRouter } from "next/navigation";

interface ChatWindowProps {
    orderId: string;
    freelancerId?: string;
}

export default function ChatWindow({ orderId, freelancerId }: ChatWindowProps) {
    const { messages, isConnected } = useSelector((state: RootState) => state.chat);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { sendSocketMessage, error: socketError } = useSocket(orderId, freelancerId);
    const dispatch = useDispatch();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const theme = useTheme();

    useEffect(() => {
        if (socketError) {
            setError(socketError);
        }
    }, [socketError]);

    useEffect(() => {
        if (messages && messages.length > 0) {
            dispatch(markMessagesAsRead());
        }
    }, [dispatch, freelancerId]);

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



    // Если есть ошибка подключения, показываем сообщение
    if (socketError && !isConnected) {
        return (
            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 3,
                    p: 4,
                    textAlign: 'center'
                }}
            >
                <WifiOffIcon sx={{ fontSize: 64, color: 'error.main', opacity: 0.7 }} />
                <Typography variant="h5" color="error.main" fontWeight="600">
                    Ошибка подключения
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                    Не удалось подключиться к серверу чата. Проверьте интернет-соединение.
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => window.location.reload()}
                    size="large"
                    sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        px: 4,
                        py: 1.5
                    }}
                >
                    Обновить страницу
                </Button>
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                overflow: 'hidden'
            }}
        >
                {/* Заголовок чата */}
                <Box 
                    sx={{ 
                        p: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChatIcon color="primary" />
                        <Typography variant="h6" fontWeight="600">
                            Чат по заказу
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isConnected ? (
                            <WifiIcon color="success" sx={{ fontSize: 20 }} />
                        ) : (
                            <WifiOffIcon color="error" sx={{ fontSize: 20 }} />
                        )}
                        <Typography 
                            variant="caption" 
                            color={isConnected ? 'success.main' : 'error.main'}
                            fontWeight="500"
                        >
                            {isConnected ? 'Подключено' : 'Отключено'}
                        </Typography>
                    </Box>
                </Box>
                
                {/* Область сообщений */}
                <Box 
                    sx={{ 
                        flexGrow: 1,
                        overflow: 'auto',
                        p: 2,
                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : '#fafafa',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '3px',
                        },
                    }}
                >
                    {!messages || messages.length === 0 ? (
                        <Box 
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: 2
                            }}
                        >
                            <ChatIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                            <Typography variant="h6" color="text.secondary" align="center">
                                Сообщений пока нет
                            </Typography>
                            <Typography variant="body2" color="text.disabled" align="center">
                                Начните общение, отправив первое сообщение
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <Message key={msg.id} message={msg} />
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </Box>

                <Divider />

                {/* Поле ввода */}
                <Box 
                    component="form"
                    onSubmit={handleSendMessage}
                    sx={{ 
                        p: 2,
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-end'
                    }}
                >
                    <TextField
                        placeholder="Введите сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        multiline
                        maxRows={4}
                        disabled={!isConnected || isSending}
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                            }
                        }}
                        error={!isConnected}
                        helperText={!isConnected ? "Нет соединения с сервером" : ""}
                    />
                    <IconButton 
                        type="submit"
                        color="primary"
                        disabled={!isConnected || !message.trim() || isSending}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                            '&:disabled': {
                                backgroundColor: 'grey.300',
                                color: 'grey.500',
                            },
                            width: 48,
                            height: 48,
                            borderRadius: 2
                        }}
                    >
                        {isSending ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <SendIcon />
                        )}
                    </IconButton>
                </Box>

                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        severity="error" 
                        onClose={handleCloseError}
                        sx={{ borderRadius: 2 }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        );
}