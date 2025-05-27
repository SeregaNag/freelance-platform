import { useDispatch } from "react-redux";
import { setIsConnected, setOrderId, sendMessage, getMessages, setApplicants } from "@/features/chatSlice";
import { Message } from "@/types/message";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ErrorResponse {
    error: boolean;
    message: string;
}

interface FreelancerResponse {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface JoinOrderResponse {
    applicants?: FreelancerResponse[];
    messages: Message[];
}

function isErrorResponse(obj: any): obj is ErrorResponse {
    return obj && typeof obj === 'object' && 'error' in obj && obj.error === true;
}

function isJoinOrderResponse(obj: any): obj is JoinOrderResponse {
    return obj && typeof obj === 'object' && 'applicants' in obj && Array.isArray(obj.messages);
}

export default function useSocket(orderId: string, freelancerId?: string) {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
            path: '/chat',
            withCredentials: true,
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketRef.current.on('connect', () => {
            dispatch(setIsConnected(true));
            
            if (orderId) {
                setTimeout(() => {
                    const payload = { orderId };
                    
                    // Если указан ID фрилансера, добавляем его в запрос
                    if (freelancerId) {
                        Object.assign(payload, { freelancerId });
                    }
                    
                    socketRef.current?.emit('joinOrder', payload, (response: any) => {
                        
                        if (isErrorResponse(response)) {
                            console.error('Error joining order:', response.message);
                            setError(response.message);
                            dispatch(getMessages([]));
                        } else if (isJoinOrderResponse(response)) {
                            // Обрабатываем специальный ответ с аппликантами и сообщениями
                            if (response.applicants) {
                                dispatch(setApplicants(response.applicants));
                            }
                            dispatch(getMessages(response.messages || []));
                        } else if (Array.isArray(response)) {
                            dispatch(getMessages(response));
                        } else {
                            console.error('Unknown response format:', response);
                            dispatch(getMessages([]));
                        }
                    });
                }, 1000);
            }
        });
        
        socketRef.current.on('disconnect', () => {
            dispatch(setIsConnected(false));
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            dispatch(setIsConnected(false));
        });

        socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socketRef.current.on('message', (message: Message) => {
            // Проверяем, что message имеет все необходимые поля, чтобы избежать ошибок
            if (message && message.id && message.content && message.orderId) {
                dispatch(sendMessage(message));
            } else {
                console.error('Invalid message format received:', message);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [orderId, freelancerId, dispatch]);

    const sendSocketMessage = async (content: string) => {
        if (!socketRef.current) {
            throw new Error('Socket not connected');
        }

        if (!socketRef.current.connected) {
            throw new Error('Socket connection lost');
        }

        return new Promise((resolve, reject) => {
            // Увеличим таймаут до 10 секунд
            const timeout = setTimeout(() => {
                reject(new Error('Message sending timeout'));
            }, 10000); // 10 секунд вместо 5

            const payload = { 
                orderId, 
                content 
            };
            
            // Если указан конкретный фрилансер, добавляем его ID в запрос
            if (freelancerId) {
                Object.assign(payload, { receiverId: freelancerId });
            }

            socketRef.current?.emit('message', payload, (response: any) => {
                clearTimeout(timeout);
                
                try {
                    if (isErrorResponse(response)) {
                        console.error('Error sending message:', response.message);
                        reject(new Error(response.message));
                    } else if (response) {
                        resolve(response);
                    } else {
                        reject(new Error('Failed to send message'));
                    }
                } catch (e) {
                    console.error('Error handling socket response:', e);
                    reject(new Error('Error processing server response'));
                }
            });
        });
    };

    return { sendSocketMessage, error };
}