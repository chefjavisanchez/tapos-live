import type { Metadata } from "next";
import { Inter, Syncopate, Rajdhani } from "next/font/google";
import "./globals.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/bold";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const syncopate = Syncopate({ weight: "700", subsets: ["latin"], variable: '--font-syncopate' });
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: '--font-rajdhani' });

export const metadata: Metadata = {
    metadataBase: new URL('https://tapos360.com'),
    title: {
        default: "TapOS Impulsó | The Ultimate Digital Identity",
        template: "%s | TapOS Impulsó"
    },
    description: "Upgrade your networking with TapOS Impulsó. The intelligent NFC digital business card that shares your profile, captures leads, and tracks analytics instantly. No app required.",
    keywords: ["Digital Business Card", "NFC Card", "Networking Tool", "Business Card Scanner", "Lead Generation", "TapOS", "Impulso", "Smart Business Card"],
    authors: [{ name: "TapOS Impulsó", url: "https://tapos360.com" }],
    creator: "TapOS Team",
    publisher: "TapOS Impulsó",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://tapos360.com",
        siteName: "TapOS Impulsó",
        title: "TapOS Impulsó | The Networking Revolution",
        description: "Don't just share a contact. Share an experience. The world's most advanced digital business card platform.",
        images: [
            {
                url: "/tapos-logo.png",
                width: 1200,
                height: 630,
                alt: "TapOS Impulsó Digital Card",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "TapOS Impulsó | Next-Gen Networking",
        description: "Share your contact info with a single tap. The premium digital card for modern professionals.",
        images: ["/tapos-logo.png"],
        creator: "@tapos_impulso",
    },
    icons: {
        icon: '/tapos-logo.png',
        shortcut: '/tapos-logo.png',
        apple: '/tapos-logo.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/tapos-logo.png',
        },
    },
    appleWebApp: {
        capable: true,
        title: "TapOS",
        statusBarStyle: "black-translucent",
        startupImage: ["/tapos-logo.png"],
    },
    category: "productivity",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* REMOVED EXTERNAL FONTS - Using local/Next fonts */}
            </head>
            <body className={`${inter.variable} ${syncopate.variable} ${rajdhani.variable} bg-black text-white antialiased`}>{children}</body>
        </html>
    );
}
