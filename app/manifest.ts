import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TapOS Impulsó',
        short_name: 'TapOS',
        description: 'The Next-Gen NFC Digital Business Card',
        start_url: '/',
        display: 'standalone',
        background_color: '#050510',
        theme_color: '#00f3ff',
        icons: [
            {
                src: '/tapos-logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/tapos-logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
