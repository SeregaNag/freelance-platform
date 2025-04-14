import { useSelector, useDispatch } from "react-redux";
import { ChatState } from "../types/message";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Badge } from "@mui/material";
import { useState, useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import { markMessagesAsRead } from "@/features/chatSlice";
import { Message } from "./Message";

interface ChatWindowProps {
    orderId: string;
}

export default function ChatWindow({ orderId }: ChatWindowProps) {
    const { messages, isConnected, unreadCount } = useSelector((state: { chat: ChatState }) => state.chat);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { sendSocketMessage } = useSocket(orderId);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(markMessagesAsRead());
    }, [dispatch]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendSocketMessage(message);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

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
                {unreadCount > 0 && (
                    <Badge 
                        badgeContent={unreadCount} 
                        color="error"
                        sx={{ ml: 2 }}
                    >
                        <Typography variant="body2">Непрочитанные сообщения</Typography>
                    </Badge>
                )}
            </Box>
            
            <Paper sx={{ flexGrow: 1, mb: 2, overflow: 'auto', p: 2 }}>
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
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
                />
                <Button 
                    variant="contained" 
                    onClick={handleSendMessage}
                    disabled={!isConnected || !message.trim() || isSending}
                >
                    {isSending ? <CircularProgress size={24} /> : 'Send'}
                </Button>
            </Box>
        </Box>
    );
}