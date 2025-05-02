import CssBaseline from '@mui/material/CssBaseline';
import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers';
import ReduxProvider from '@/components/ReduxProvider';
import { Metadata } from 'next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Freelance Platform - Фриланс биржа',
  description: 'Платформа для фрилансеров и заказчиков. Найдите работу или исполнителя для вашего проекта.',
  keywords: 'фриланс, фрилансеры, заказы, проекты, удаленная работа',
  openGraph: {
    title: 'Freelance Platform - Фриланс биржа',
    description: 'Платформа для фрилансеров и заказчиков. Найдите работу или исполнителя для вашего проекта.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <Providers>
            <CssBaseline />
            <Header />
            {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
