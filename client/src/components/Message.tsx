import React from 'react';
import { Message as MessageType } from '../types/chat';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const profile = useSelector((state: RootState) => state.profile.profile);
    const isOwnMessage = message.senderId === profile?.id;

    const getStatusIcon = () => {
        if (!isOwnMessage) return null;
        
        switch (message.status) {
            case 'SENT':
                return '✓';
            case 'DELIVERED':
                return '✓✓';
            case 'READ':
                return '✓✓';
            default:
                return null;
        }
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
                <div className="text-sm">{message.content}</div>
                <div className="flex justify-end items-center mt-1">
                    <span className="text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isOwnMessage && (
                        <span className="ml-1 text-xs opacity-70">
                            {getStatusIcon()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}; 