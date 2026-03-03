export function generateCalendarLinks(event: {
    title: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
}) {
    const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const text = encodeURIComponent(event.title);
    const dates = `${formatDate(event.start)}/${formatDate(event.end)}`;

    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;

    // Basic .ics implementation
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatDate(event.start)}`,
        `DTEND:${formatDate(event.end)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const icsDataUri = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

    return { googleUrl, icsDataUri };
}
