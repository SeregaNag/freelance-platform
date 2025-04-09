import { useDispatch } from "react-redux";
import { setIsConnected, setOrderId, sendMessage } from "@/features/chatSlice";
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
        });

        socketRef.current.on('connect', () => {
            dispatch(setIsConnected(true));
        });
        
        socketRef.current.on('disconnect', () => {
            dispatch(setIsConnected(false));
        });

        socketRef.current.on('message', (message: Message) => {
            dispatch(sendMessage(message));
        });

        if(orderId) {
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
            socketRef.current.emit('message', { content, orderId });
        }
    }

    return { sendMessage: sendMessageHandler };
}