import { useDispatch } from "react-redux";
import { setIsConnected, setOrderId, sendMessage, getMessages } from "@/features/chatSlice";
import { Message } from "@/types/message";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(orderId: string) {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();

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
                    socketRef.current?.emit('joinOrder', { orderId }, (messages: Message[]) => {
                        dispatch(getMessages(messages));
                    });
                }, 1000);
            }
        });
        
        socketRef.current.on('disconnect', () => {
            dispatch(setIsConnected(false));
        });

        socketRef.current.on('message', (message: Message) => {
            dispatch(sendMessage(message));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [orderId, dispatch]);

    const sendSocketMessage = async (content: string) => {
        if (!socketRef.current) {
            throw new Error('Socket not connected');
        }

        return new Promise((resolve, reject) => {
            socketRef.current?.emit('message', { orderId, content }, (response: Message) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Failed to send message'));
                }
            });
        });
    };

    return { sendSocketMessage };
}