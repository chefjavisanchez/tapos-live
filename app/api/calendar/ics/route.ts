import { NextResponse } from 'next/server';

export async function GET() {
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TapOS//Event Passport//EN',
        'BEGIN:VEVENT',
        'UID:konecta-spring-expo-2026',
        'DTSTAMP:20260302T000000Z',
        'DTSTART:20260430T210000Z', // UTC for 5pm EST (assuming EDT is -4)
        'DTEND:20260501T010000Z',   // UTC for 9pm EST
        'SUMMARY:Konecta con Crema Spring Expo',
        'DESCRIPTION:Official event for business networking and raffle. Show your TapOS Passport QR to participate!',
        'LOCATION:TBD',
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
