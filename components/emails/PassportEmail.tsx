export interface PassportEmailTemplateProps {
    fullName: string;
    slug: string;
    qrUrl: string;
}

export const getPassportEmailHtml = ({
    fullName,
    slug,
    qrUrl,
}: PassportEmailTemplateProps) => {
    const accessId = slug.split('-')[1]?.toUpperCase() || 'GUEST';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Event Passport</title>
</head>
<body style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #050505; margin: 0; padding: 0; width: 100%;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header / Logo Area -->
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; padding: 12px 24px; border-radius: 20px; background-color: rgba(255, 222, 0, 0.1); border: 1px solid rgba(255, 222, 0, 0.3);">
                <span style="color: #ffde00; font-size: 18px; font-weight: bold; letter-spacing: 2px;">TAPOS 3.0</span>
            </div>
        </div>

        <!-- Main Ticket Card -->
        <div style="background-color: #111111; border-radius: 40px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; overflow: hidden;">
            <!-- Main Content -->
            <div style="position: relative; z-index: 1;">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 8px 0; font-style: italic;">ACCESS GRANTED</h1>

                <div style="display: inline-block; padding: 4px 16px; background-color: #ffde00; border-radius: 50px; margin-bottom: 40px;">
                    <span style="color: #000000; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">OFFICIAL EVENT GUEST</span>
                </div>

                <div style="background-color: #ffffff; padding: 24px; border-radius: 32px; display: inline-block; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(255,255,255,0.1);">
                    <img src="${qrUrl}" alt="Passport QR Code" style="width: 220px; height: 220px; display: block;" />
                </div>

                <div style="margin-bottom: 40px; text-align: center;">
                    <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px;">SECRET ACCESS ID</p>
                    <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 42px; font-weight: 900; letter-spacing: 2px; font-family: 'Syncopate', sans-serif;">${accessId}</p>
                </div>

                <div style="text-align: left; margin-bottom: 40px;">
                    <div style="margin-bottom: 25px;">
                        <p style="font-size: 11px; color: #666666; text-transform: uppercase; font-weight: 900; letter-spacing: 2px; margin: 0 0 5px 0;">GUEST NAME</p>
                        <p style="font-size: 22px; color: #ffffff; font-weight: bold; margin: 0;">${fullName}</p>
                    </div>

                    <div style="display: table; width: 100%; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px;">
                        <div style="display: table-cell; width: 50%;">
                            <p style="font-size: 11px; color: #666666; text-transform: uppercase; font-weight: 900; letter-spacing: 2px; margin: 0 0 5px 0;">EVENT</p>
                            <p style="font-size: 14px; color: #ffde00; font-weight: bold; margin: 0;">KONECTA SPRING EXPO</p>
                        </div>
                        <div style="display: table-cell; width: 50%;">
                            <p style="font-size: 11px; color: #666666; text-transform: uppercase; font-weight: 900; letter-spacing: 2px; margin: 0 0 5px 0;">DATE</p>
                            <p style="font-size: 14px; color: #ffffff; font-weight: bold; margin: 0;">APRIL 30, 2026</p>
                        </div>
                    </div>
                </div>

                <div style="background-color: rgba(255,255,255,0.03); border-radius: 24px; padding: 25px; margin-bottom: 40px; border: 1px solid rgba(255,255,255,0.05);">
                    <p style="font-size: 13px; color: #aaaaaa; margin: 0 0 15px 0; line-height: 1.6;">
                        Save your pass to your calendar to stay updated on raffle alerts and exclusive networking sessions.
                    </p>
                    <div style="text-align: center;">
                        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=Konecta%20con%20Crema%20Spring%20Expo&dates=20260430T210000Z/20260501T010000Z&details=Official%20event%20for%20business%20networking%20and%20raffle.%20Show%20your%20TapOS%20Passport%20QR%20to%20participate!&location=TBD&sf=true&output=xml" style="display: inline-block; background-color: #222222; color: #ffffff; padding: 12px 20px; border-radius: 15px; text-decoration: none; font-size: 11px; font-weight: bold; border: 1px solid rgba(255,255,255,0.1); margin: 5px;">GOOGLE CALENDAR</a>
                        <a href="https://tapos360.com/api/calendar/ics" style="display: inline-block; background-color: #222222; color: #ffffff; padding: 12px 20px; border-radius: 15px; text-decoration: none; font-size: 11px; font-weight: bold; border: 1px solid rgba(255,255,255,0.1); margin: 5px;">OUTLOOK / APPLE</a>
                    </div>
                </div>

                <a href="https://tapos360.com/${slug}" style="display: block; background-color: #ffde00; color: #000000; padding: 20px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(255, 222, 0, 0.2);">OPEN DIGITAL PASSPORT</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px;">
            <p style="color: #444444; font-size: 10px; margin: 0 0 10px 0; letter-spacing: 3px;">THE FUTURE OF NETWORKING IS HERE.</p>
            <div style="width: 40px; height: 1px; background-color: #333; margin: 0 auto 20px auto;"></div>
            <p style="color: #666666; font-size: 10px; margin: 0;">© 2026 TapOS Global. Sent via Resend.</p>
        </div>
    </div>
</body>
</html>
`;
};
