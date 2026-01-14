import type { Metadata } from "next";
import { Inter, Syncopate, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const syncopate = Syncopate({ weight: "700", subsets: ["latin"], variable: '--font-syncopate' });
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: '--font-rajdhani' });

export const metadata: Metadata = {
    title: "TapOS Platform",
    description: "The Next-Gen Digital Business Card Builder",
    openGraph: {
        images: ['/opengraph-image.png'],
    },
    icons: {
        icon: '/opengraph-image.png',
        apple: '/opengraph-image.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body className={`${inter.variable} ${syncopate.variable} ${rajdhani.variable} bg-black text-white antialiased`}>{children}</body>
        </html>
    );
}
