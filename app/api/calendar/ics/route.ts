import { NextResponse } from 'next/server';
import { EVENT_CONFIG } from '@/lib/event-config';

export async function GET() {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TapOS//Event Passport//EN',
        'BEGIN:VEVENT',
        'UID:konecta-spring-expo-2026',
        'DTSTAMP:20260302T000000Z',
        'DTSTART:20260430T210000Z', 
        'DTEND:20260501T010000Z',   
        `SUMMARY:${EVENT_CONFIG.title}`,
        `DESCRIPTION:${EVENT_CONFIG.description}`,
        `LOCATION:${EVENT_CONFIG.address}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return new NextResponse(icsContent, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'attachment; filename="event-passport.ics"',
        },
    });
}
