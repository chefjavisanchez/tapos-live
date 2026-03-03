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
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundColor: '#050505',
        margin: '0',
        padding: '0',
        width: '100%',
    }}>
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px 20px',
        }}>
            {/* Header / Logo Area */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 222, 0, 0.1)',
                    border: '1px solid rgba(255, 222, 0, 0.3)',
                }}>
                    <span style={{
                        color: '#ffde00',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                    }}>TAPOS 3.0</span>
                </div>
            </div>

            {/* Main Ticket Card */}
            <div style={{
                backgroundColor: '#111111',
                borderRadius: '40px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Accent Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255, 222, 0, 0.15) 0%, transparent 70%)',
                    zIndex: '0',
                }}></div>

                <div style={{ position: 'relative', zIndex: '1' }}>
                    <h1 style={{
                        color: '#ffffff',
                        fontSize: '28px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '-1px',
                        margin: '0 0 8px 0',
                        fontStyle: 'italic',
                    }}>ACCESS GRANTED</h1>

                    <div style={{
                        display: 'inline-block',
                        padding: '4px 16px',
                        backgroundColor: '#ffde00',
                        borderRadius: '50px',
                        marginBottom: '40px',
                    }}>
                        <span style={{
                            color: '#000000',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>OFFICIAL EVENT GUEST</span>
                    </div>

                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '24px',
                        borderRadius: '32px',
                        display: 'inline-block',
                        marginBottom: '40px',
                        boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                    }}>
                        <img src={qrUrl} alt="Passport QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />
                        <div style={{
                            marginTop: '15px',
                            color: '#111',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>ENTRY PASS: {slug.split('-')[1].toUpperCase()}</div>
                    </div>

                    <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                        <div style={{ marginBottom: '25px' }}>
                            <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0' }}>GUEST NAME</p>
                            <p style={{ fontSize: '22px', color: '#ffffff', fontWeight: 'bold', margin: '0' }}>{fullName}</p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: '25px'
                        }}>
                            <div>
                                <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0' }}>EVENT</p>
                                <p style={{ fontSize: '14px', color: '#ffde00', fontWeight: 'bold', margin: '0' }}>KONECTA SPRING EXPO</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', color: '#666666', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', margin: '0 0 5px 0' }}>DATE</p>
                                <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: 'bold', margin: '0' }}>APRIL 30, 2026</p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '24px',
                        padding: '25px',
                        marginBottom: '40px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <p style={{
                            fontSize: '13px',
                            color: '#aaaaaa',
                            margin: '0 0 15px 0',
                            lineHeight: '1.6'
                        }}>
                            Save your pass to your calendar to stay updated on raffle alerts and exclusive networking sessions.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Konecta%20con%20Crema%20Spring%20Expo&dates=20260430T210000Z/20260501T010000Z&details=Official%20event%20for%20business%20networking%20and%20raffle.%20Show%20your%20TapOS%20Passport%20QR%20to%20participate!&location=TBD&sf=true&output=xml" style={{
                                flex: '1',
                                backgroundColor: '#222222',
                                color: '#ffffff',
                                padding: '12px',
                                borderRadius: '15px',
                                textDecoration: 'none',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.1)',
                                textAlign: 'center'
                            }}>GOOGLE CALENDAR</a>
                            <a href="https://tapos360.com/api/calendar/ics" style={{
                                flex: '1',
                                backgroundColor: '#222222',
                                color: '#ffffff',
                                padding: '12px',
                                borderRadius: '15px',
                                textDecoration: 'none',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.1)',
                                textAlign: 'center'
                            }}>OUTLOOK / APPLE</a>
                        </div>
                    </div>

                    <a href={`https://tapos360.com/${slug}`} style={{
                        display: 'block',
                        backgroundColor: '#ffde00',
                        color: '#000000',
                        padding: '20px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        fontWeight: '900',
                        fontSize: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 10px 20px rgba(255, 222, 0, 0.2)',
                    }}>OPEN DIGITAL PASSPORT</a>
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <p style={{ color: '#444444', fontSize: '10px', margin: '0 0 10px 0', letterSpacing: '3px' }}>
                    THE FUTURE OF NETWORKING IS HERE.
                </p>
                <div style={{ width: '40px', height: '1px', backgroundColor: '#333', margin: '0 auto 20px auto' }}></div>
                <p style={{ color: '#666666', fontSize: '10px', margin: '0' }}>
                    © 2026 TapOS Global. Sent via Resend.
                </p>
            </div>
        </div>
    </div>
);
