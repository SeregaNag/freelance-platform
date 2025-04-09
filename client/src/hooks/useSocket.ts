import { useDispatch } from "react-redux";
import { setIsConnected, setOrderId, sendMessage, getMessages } from "@/features/chatSlice";
import { Message } from "@/types/message";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(orderId: string) {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        console.log('Token from cookie:', token);
        
        // Загружаем историю сообщений
        const loadMessages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat/messages/${orderId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error loading messages:', errorData);
                    throw new Error(errorData.message || 'Failed to load messages');
                }
                
                const messages = await response.json();
                console.log('Loaded messages:', messages);
                dispatch(getMessages(messages));
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        if (orderId) {
            loadMessages();
        }
        
        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
            path: '/chat',
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: {
                token: token
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to socket');
            dispatch(setIsConnected(true));
        });
        
        socketRef.current.on('disconnect', (reason) => {
            console.log('Disconnected from socket:', reason);
            dispatch(setIsConnected(false));
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        socketRef.current.on('message', (message: Message) => {
            console.log('Received message:', message);
            dispatch(sendMessage(message));
        });

        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
        });

        if(orderId) {
            console.log('Joining order:', orderId);
            socketRef.current.emit('joinOrder', { orderId });
        }

        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, [orderId, dispatch]);

    const sendMessageHandler = (content: string) => {
        if(socketRef.current && orderId) {
            console.log('Sending message:', { content, orderId });
            socketRef.current.emit('message', { content, orderId }, (response: any) => {
                if (response.error) {
                    console.error('Error sending message:', response.error);
                } else {
                    console.log('Message sent successfully:', response);
                }
            });
        }
    }

    return { sendMessage: sendMessageHandler };
}