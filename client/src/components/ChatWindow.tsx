import { useSelector } from "react-redux";
import { ChatState } from "../types/message";
import { TextField, Button, Box, Typography, Paper, List, ListItem, ListItemText, Chip, CircularProgress } from "@mui/material";
import { useState } from "react";
import useSocket from "@/hooks/useSocket";

interface ChatWindowProps {
    orderId: string;
}

export default function ChatWindow({ orderId }: ChatWindowProps) {
    const { messages, isConnected } = useSelector((state: { chat: ChatState }) => state.chat);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { sendMessage: sendSocketMessage } = useSocket(orderId);

    const handleSendMessage = async () => {
        if (message.trim() && isConnected && !isSending) {
            try {
                setIsSending(true);
                await sendSocketMessage(message);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Chat</Typography>
                <Chip 
                    label={isConnected ? "Connected" : "Disconnected"} 
                    color={isConnected ? "success" : "error"}
                    size="small"
                    sx={{ ml: 2 }}
                />
            </Box>
            
            <Paper sx={{ flexGrow: 1, mb: 2, overflow: 'auto' }}>
                <List>
                    {messages.map((msg) => (
                        <ListItem key={msg.id}>
                            <ListItemText
                                primary={msg.content}
                                secondary={`${msg.sender.name} - ${new Date(msg.createdAt).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
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
                            handleSendMessage();
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