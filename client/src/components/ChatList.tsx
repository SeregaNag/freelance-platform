import React, { useState, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Badge,
    Divider,
    Paper,
    TextField,
    InputAdornment,
    useTheme,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChatItem } from '@/types/chat';

interface ChatListProps {
    selectedChatId?: string;
    onChatSelect: (orderId: string, freelancerId?: string) => void;
}

export default function ChatList({ selectedChatId, onChatSelect }: ChatListProps) {
    const theme = useTheme();
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загружаем список чатов с API
    useEffect(() => {
        const fetchChats = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Не удалось загрузить список чатов');
                }

                const data: ChatItem[] = await response.json();
                setChats(data);
            } catch (err) {
                console.error('Error fetching chats:', err);
                setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке чатов');
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const filteredChats = chats.filter(chat =>
        chat.orderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return format(date, 'HH:mm', { locale: ru });
        } else {
            return format(date, 'dd.MM', { locale: ru });
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                borderRight: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* Заголовок и поиск */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                    Чаты
                </Typography>
                <TextField
                    placeholder="Поиск чатов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={loading}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                        }
                    }}
                />
            </Box>

            {/* Список чатов */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {loading ? (
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px'
                        }}
                    >
                        <CircularProgress size={40} />
                    </Box>
                ) : error ? (
                    <Box 
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '200px',
                            gap: 1,
                            p: 2
                        }}
                    >
                        <Typography variant="body2" color="error" align="center">
                            {error}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" align="center">
                            Попробуйте обновить страницу
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {filteredChats.map((chat, index) => (
                            <React.Fragment key={`${chat.orderId}-${chat.participantId}`}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedChatId === chat.orderId}
                                        onClick={() => onChatSelect(chat.orderId, chat.participantId)}
                                        sx={{
                                            py: 1.5,
                                            px: 2,
                                            '&.Mui-selected': {
                                                backgroundColor: theme.palette.mode === 'dark' 
                                                    ? 'rgba(33, 150, 243, 0.12)' 
                                                    : 'rgba(33, 150, 243, 0.08)',
                                                borderRight: '3px solid',
                                                borderRightColor: 'primary.main'
                                            },
                                            '&:hover': {
                                                backgroundColor: theme.palette.mode === 'dark' 
                                                    ? 'grey.800' 
                                                    : 'grey.50'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                variant="dot"
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        backgroundColor: chat.isOnline ? '#44b700' : 'grey.400',
                                                        color: chat.isOnline ? '#44b700' : 'grey.400',
                                                        '&::after': {
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '50%',
                                                            animation: chat.isOnline ? 'ripple 1.2s infinite ease-in-out' : 'none',
                                                            border: '1px solid currentColor',
                                                            content: '""',
                                                        },
                                                    },
                                                    '@keyframes ripple': {
                                                        '0%': {
                                                            transform: 'scale(.8)',
                                                            opacity: 1,
                                                        },
                                                        '100%': {
                                                            transform: 'scale(2.4)',
                                                            opacity: 0,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Avatar 
                                                    src={chat.participantAvatar || undefined}
                                                    sx={{ 
                                                        width: 48, 
                                                        height: 48,
                                                        bgcolor: 'primary.main'
                                                    }}
                                                >
                                                    {chat.participantName[0].toUpperCase()}
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            {/* Верхняя строка: имя и время/счетчик */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                <Typography 
                                                    variant="subtitle2" 
                                                    fontWeight="600"
                                                    sx={{ 
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '70%'
                                                    }}
                                                >
                                                    {chat.participantName}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {chat.lastMessageTime && (
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.secondary"
                                                            sx={{ fontSize: '0.75rem' }}
                                                        >
                                                            {formatTime(chat.lastMessageTime)}
                                                        </Typography>
                                                    )}
                                                    {chat.unreadCount > 0 && (
                                                        <Badge 
                                                            badgeContent={chat.unreadCount} 
                                                            color="primary"
                                                            sx={{
                                                                '& .MuiBadge-badge': {
                                                                    fontSize: '0.75rem',
                                                                    height: 18,
                                                                    minWidth: 18
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                            
                                            {/* Название заказа */}
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{ 
                                                    display: 'block',
                                                    fontSize: '0.75rem',
                                                    mb: 0.5,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {chat.orderTitle}
                                            </Typography>
                                            
                                            {/* Последнее сообщение */}
                                            {chat.lastMessage && (
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ 
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {chat.lastMessage}
                                                </Typography>
                                            )}
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                                {index < filteredChats.length - 1 && (
                                    <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                )}
                
                {!loading && !error && filteredChats.length === 0 && (
                    <Box 
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '200px',
                            gap: 1,
                            p: 2
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" align="center">
                            {searchQuery ? 'Чаты не найдены' : 'Нет активных чатов'}
                        </Typography>
                        {!searchQuery && (
                            <Typography variant="caption" color="text.disabled" align="center">
                                Чаты появятся после подачи заявок на заказы
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
} 