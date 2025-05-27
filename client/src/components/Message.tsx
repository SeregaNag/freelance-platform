import React from 'react';
import { Message as MessageType } from '../types/chat';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const profile = useSelector((state: RootState) => state.profile.profile);
    const theme = useTheme();
    const isOwnMessage = message.senderId === profile?.id;

    const getStatusIcon = () => {
        if (!isOwnMessage) return null;
        
        switch (message.status) {
            case 'SENT':
                return <CheckIcon sx={{ fontSize: 14, opacity: 0.7 }} />;
            case 'DELIVERED':
                return <DoneAllIcon sx={{ fontSize: 14, opacity: 0.7 }} />;
            case 'READ':
                return <DoneAllIcon sx={{ fontSize: 14, opacity: 0.7, color: 'primary.main' }} />;
            default:
                return null;
        }
    };

    const formatTime = (date: string) => {
        return format(new Date(date), 'HH:mm', { locale: ru });
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                mb: 2,
                px: 1
            }}
        >
            {!isOwnMessage && (
                <Avatar 
                    sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1, 
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem'
                    }}
                >
                    {(message.sender?.name || 'U')[0].toUpperCase()}
                </Avatar>
            )}
            
            <Box
                sx={{
                    maxWidth: '70%',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    backgroundColor: isOwnMessage 
                        ? 'primary.main' 
                        : theme.palette.mode === 'dark' 
                            ? 'grey.800' 
                            : 'grey.100',
                    color: isOwnMessage 
                        ? 'primary.contrastText' 
                        : 'text.primary',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    '&::before': isOwnMessage ? {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        right: -8,
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: `8px solid ${theme.palette.primary.main}`,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                    } : {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: -8,
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderRight: `8px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100]}`,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                    }
                }}
            >
                <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-word' }}>
                    {message.content}
                </Typography>
                
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center',
                        gap: 0.5
                    }}
                >
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            opacity: 0.7,
                            fontSize: '0.75rem'
                        }}
                    >
                        {formatTime(message.createdAt)}
                    </Typography>
                    {getStatusIcon()}
                </Box>
            </Box>
            
            {isOwnMessage && (
                <Avatar 
                    sx={{ 
                        width: 32, 
                        height: 32, 
                        ml: 1, 
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem'
                    }}
                >
                    {(profile?.name || 'Я')[0].toUpperCase()}
                </Avatar>
            )}
        </Box>
    );
}; 