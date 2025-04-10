'use client';

import { useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return <div>Order ID is required</div>;
    }

    return <ChatWindow orderId={orderId} />;
} 