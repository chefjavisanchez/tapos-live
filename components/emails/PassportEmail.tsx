import * as React from 'react';

interface PassportEmailTemplateProps {
    fullName: string;
    slug: string;
    qrUrl: string;
}

export const PassportEmailTemplate: React.FC<Readonly<PassportEmailTemplateProps>> = ({
    fullName,
    slug,
    qrUrl,
}) => (
    <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '40px 20px',
        textAlign: 'center',
    }}>
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#111111',
            borderRadius: '40px',
            padding: '40px',
            border: '1px solid #333333',
        }}>
            <h1 style={{
                color: '#ffde00',
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '-0.05em',
                margin: '0 0 10px 0',
            }}>PASSPORT ACTIVATED</h1>

            <p style={{
                fontSize: '14px',
                color: '#888888',
                marginBottom: '30px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
            }}>Konecta con Crema Spring Expo</p>

            <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '30px',
            }}>
                <img src={qrUrl} alt="Your Passport QR" style={{ width: '200px', height: '200px' }} />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                <p style={{ fontSize: '10px', color: '#666666', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 5px 0' }}>Guest Name</p>
                <p style={{ fontSize: '18px', color: '#ffffff', fontWeight: 'bold', margin: '0 0 20px 0' }}>{fullName}</p>

                <p style={{ fontSize: '10px', color: '#666666', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 5px 0' }}>Passport ID</p>
                <p style={{ fontSize: '14px', color: '#ffffff', margin: '0' }}>{slug}</p>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid #222222', margin: '30px 0' }} />

            <div style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '10px', color: '#666666', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 10px 0', textAlign: 'center' }}>Save Event to Calendar</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Konecta%20con%20Crema%20Spring%20Expo&dates=20260430T210000Z/20260501T010000Z&details=Official%20event%20for%20business%20networking%20and%20raffle.%20Show%20your%20TapOS%20Passport%20QR%20to%20participate!&location=TBD&sf=true&output=xml" style={{
                        backgroundColor: '#222222',
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid #333333',
                    }}>GOOGLE</a>
                    <a href="https://tapos360.com/api/calendar/ics" style={{
                        backgroundColor: '#222222',
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        border: '1px solid #333333',
                    }}>OUTLOOK / ICAL</a>
                </div>
            </div>

            <p style={{ fontSize: '12px', color: '#666666', lineHeight: '1.6' }}>
                Show this QR at booth entrances to participate in the verified raffle and instantly share your contact info with sponsors.
            </p>

            <div style={{ marginTop: '30px' }}>
                <a href={`https://tapos360.com/${slug}`} style={{
                    backgroundColor: '#ffde00',
                    color: '#000000',
                    padding: '15px 30px',
                    borderRadius: '30px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px',
                }}>VIEW DIGITAL PASSPORT</a>
            </div>
        </div>

        <p style={{ color: '#444444', fontSize: '10px', marginTop: '40px', letterSpacing: '0.3em' }}>
            POWERED BY TAPOS 3.0
        </p>
    </div>
);
