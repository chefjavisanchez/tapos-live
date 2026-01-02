import type { Metadata } from "next";
import { Inter, Syncopate, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const syncopate = Syncopate({ weight: "700", subsets: ["latin"], variable: '--font-syncopate' });
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: '--font-rajdhani' });

export const metadata: Metadata = {
    title: "TapOS Platform",
    description: "The Next-Gen Digital Business Card Builder",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${syncopate.variable} ${rajdhani.variable} bg-black text-white antialiased`}>{children}</body>
        </html>
    );
}
