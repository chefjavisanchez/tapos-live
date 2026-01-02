'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';

const IMPULSO_STYLES = `
  :root {
      --gold: #D4AF37;
      --accent: #00f3ff;
      --danger: #ff0055;
      --bg-dark: #000000;
      --glass-panel: rgba(255, 255, 255, 0.08);
      --border-light: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  .impulso-wrapper {
      font-family: 'Inter', sans-serif;
      color: #fff;
      background: #000;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: relative;
  }

  .bg-gradient-radial {
      position: absolute;
      inset: 0;
      z-index: 0;
      background: radial-gradient(circle at 50% 15%, rgba(212, 175, 55, 0.12), transparent 60%);
  }

  #tap-os-engine {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      max-width: 480px; /* Mobile width constraint for desktop view */
      margin: 0 auto;
      background: #000;
      border-left: 1px solid #222;
      border-right: 1px solid #222;
  }

  /* HEADER */
  .header-zone {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      margin-top: env(safe-area-inset-top);
  }

  .profile-pill {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.6);
      padding: 5px 15px 5px 5px;
      border-radius: 50px;
      border: var(--border-light);
      backdrop-filter: blur(10px);
  }

  .avatar-wrap {
      position: relative;
      width: 45px;
      height: 45px;
  }

  .avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--gold);
  }

  .online-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background: #00ff88;
      border-radius: 50%;
      border: 2px solid #000;
      box-shadow: 0 0 10px #00ff88;
      animation: pulse-green 2s infinite;
  }

  @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(0, 255, 136, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
  }

  .char-info h1 {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 800;
      font-size: 1rem;
      line-height: 1;
      margin: 0;
      text-transform: uppercase;
      color: #fff;
  }

  .char-info span {
      font-size: 0.65rem;
      color: var(--gold);
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
  }

  .sys-icons {
      display: flex; gap: 8px; font-size: 0.8rem; color: rgba(255, 255, 255, 0.5);
  }

  /* MARQUEE */
  .marquee-container {
      width: 100%;
      overflow: hidden;
      background: var(--gold);
      color: #000;
      padding: 6px 0;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.8rem;
      flex-shrink: 0;
      margin-top: 5px;
  }

  .marquee-content {
      display: inline-flex;
      white-space: nowrap;
      animation: scroll-infinity 20s linear infinite;
  }

  .m-item { padding: 0 20px; text-transform: uppercase; }

  @keyframes scroll-infinity {
      0% { transform: translateX(0); }
      100% { transform: translateX(-25%); }
  }

  /* VIEWPORT & TABS */
  .viewport {
      flex-grow: 1;
      position: relative;
      margin: 10px 0;
      overflow: hidden;
  }

  .view-pane {
      position: absolute;
      inset: 0 15px;
      display: none; /* Hidden by default */
      flex-direction: column;
      animation: fadeIn 0.3s ease-out;
  }
  
  .view-pane.active { display: flex; }

  @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
  }

  /* AD CARDS */
  .ad-container { width: 100%; height: 80%; position: relative; perspective: 1000px; }
  
  .ad-card {
      position: absolute; inset: 0; border-radius: 20px; overflow: hidden;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: linear-gradient(145deg, #111, #000);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
      opacity: 0; transform: rotateY(90deg);
      transition: 0.6s;
      padding: 20px; text-align: center;
      pointer-events: none;
  }

  .ad-card.show { opacity: 1; transform: rotateY(0deg); z-index: 10; pointer-events: auto; }

  .notify-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255, 255, 255, 0.1); padding: 6px 16px;
      border-radius: 50px; font-weight: 600; font-size: 0.7rem;
      margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1);
      text-transform: uppercase;
  }
  
  .pulse-bell { color: var(--gold); animation: ring 3s infinite ease-in-out; }
  @keyframes ring { 0%,100% {transform:rotate(0)} 10%,30% {transform:rotate(15deg)} 20%,40% {transform:rotate(-15deg)} }

  .notify-dot {
      position: absolute; top: 0; right: -2px; width: 8px; height: 8px;
      background: var(--danger); border-radius: 50%;
      border: 1px solid #000; box-shadow: 0 0 5px var(--danger);
  }

  /* UPDATED SCREEN SIZES FOR ADS */
  .ad-title { 
      font-family: 'Syncopate', sans-serif; 
      font-weight: 700; 
      font-size: 1.2rem;
      line-height: 1.1; 
      margin-bottom: 10px; 
      text-transform: uppercase; 
      max-width: 100%;
      word-wrap: break-word;
  }
  .ad-title span { 
      display: block; 
      font-size: 1.6rem;
      color: var(--gold); 
      margin-top: 5px; 
      text-shadow: 0 0 20px rgba(212, 175, 55, 0.4); 
  }
  
  .ad-icon-lg { font-size: 4rem; margin-bottom: 25px; opacity: 0.8; }
  
  .urgent-btn {
      background: var(--gold); color: #000; text-decoration: none;
      padding: 16px 30px; border-radius: 50px;
      font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 1rem;
      margin-top: auto; box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
      transition: 0.2s;
  }
  .urgent-btn:active { transform: scale(0.95); }

  /* VELOCITY & BUTTONS */
  .velocity-container {
      width: 100%; overflow: hidden; margin: 20px 0; display: flex; flex-shrink: 0; min-height: 55px;
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }
  .velocity-track { display: flex; gap: 10px; width: max-content; animation: slide-infinity 15s linear infinite; }
  @keyframes slide-infinity { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }

  .soc-pill {
      display: flex; align-items: center; gap: 8px; padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1); border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; text-decoration: none;
      font-size: 0.8rem; font-weight: 600; white-space: nowrap; flex-shrink: 0;
      transition: all 0.2s ease;
  }
  .soc-pill:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.5); }

  .srv-btn {
      display: flex; align-items: center; gap: 15px; padding: 15px;
      margin-bottom: 10px; background: var(--glass-panel);
      border: var(--border-light); border-radius: 16px;
      text-decoration: none; color: #fff; transition: 0.2s; flex-shrink: 0;
  }
  .srv-btn:active { transform: scale(0.98); background: rgba(255, 255, 255, 0.15); }
  
  .btn-icon { font-size: 1.8rem; color: var(--gold); }
  .btn-txt h3 { margin: 0; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; }
  .btn-txt p { margin: 0; font-size: 0.7rem; color: #aaa; }

  /* DOCK */
  .dock-zone { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding-bottom: 20px; }
  .dock {
      background: rgba(30, 30, 30, 0.8); backdrop-filter: blur(20px);
      border: var(--border-light); padding: 10px 20px; border-radius: 40px;
      display: flex; gap: 24px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      margin-bottom: 15px;
  }
  .d-icon { font-size: 1.5rem; color: #666; transition: 0.3s; position: relative; cursor: pointer; }
  .d-icon.active { color: #fff; transform: translateY(-4px); }
  
  /* VIDEO */
   .video-frame {
      width: 100%; aspect-ratio: 16/9; background: #000;
      border: var(--border-light); border-radius: 12px; overflow: hidden;
  }
  .video-frame iframe { width: 100%; height: 100%; border: none; }

  /* SCANNER STYLES */
  .scan-btn {
      width: 60px; height: 60px;
      background: var(--accent); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
      animation: pulse-glow 2s infinite;
      cursor: pointer;
      border: 2px solid white;
  }
  .scan-list-item {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 10px;
  }

  /* HIDE NEXT.JS ERROR OVERLAY & TOASTS */
  nextjs-portal, 
  [data-nextjs-toast], 
  [data-nextjs-dialog-overlay] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
  }
`;

// SMART ICON MATCHING
const getSmartIcon = (text: string, defaultIcon: string) => {
    if (!text) return defaultIcon;
    const t = text.toLowerCase();

    // Socials & Platforms
    if (t.includes('instagram')) return 'ph-instagram-logo';
    if (t.includes('facebook')) return 'ph-facebook-logo';
    if (t.includes('linkedin')) return 'ph-linkedin-logo';
    if (t.includes('tiktok')) return 'ph-tiktok-logo';
    if (t.includes('twitter') || t.includes(' x ')) return 'ph-x-logo';
    if (t.includes('youtube')) return 'ph-youtube-logo';
    if (t.includes('whatsapp')) return 'ph-whatsapp-logo';
    if (t.includes('telegram')) return 'ph-telegram-logo';
    if (t.includes('spotify')) return 'ph-spotify-logo';
    if (t.includes('github')) return 'ph-github-logo';

    // Actions & Content
    if (t.includes('shop') || t.includes('store') || t.includes('buy')) return 'ph-shopping-cart';
    if (t.includes('call') || t.includes('phone') || t.includes('mobile')) return 'ph-phone';
    if (t.includes('book') || t.includes('schedule') || t.includes('calendar') || t.includes('appointment')) return 'ph-calendar-check';
    if (t.includes('chat') || t.includes('message') || t.includes('sms')) return 'ph-chat-circle-text';
    if (t.includes('video') || t.includes('watch') || t.includes('stream')) return 'ph-play-circle';
    if (t.includes('download') || t.includes('pdf') || t.includes('file')) return 'ph-download-simple';
    if (t.includes('location') || t.includes('map') || t.includes('address') || t.includes('directions')) return 'ph-map-pin';
    if (t.includes('mail') || t.includes('contact') || t.includes('email')) return 'ph-envelope';
    if (t.includes('web') || t.includes('site') || t.includes('link') || t.includes('visit')) return 'ph-globe';
    if (t.includes('info') || t.includes('about')) return 'ph-info';

    return defaultIcon;
};

interface CardEngineProps {
    data: any;
    slug: string;
}

export default function CardEngine({ data, slug }: CardEngineProps) {
    const searchParams = useSearchParams();
    const initialView = searchParams.get('view') || 'v-home';
    const [activeTab, setActiveTab] = useState(initialView);
    const [activeAd, setActiveAd] = useState(0);

    // SCANNER STATE
    const [scannedContacts, setScannedContacts] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('tapos_leads');
        if (saved) setScannedContacts(JSON.parse(saved));
    }, []);

    // Calculate valid ads
    const allAds = ['ad1', 'ad2', 'ad3', 'ad4', 'ad5'];
    const validAds = allAds.filter((key, idx) => idx === 0 || (data[key] && data[key].title1));
    const adsToRender = validAds.length > 0 ? validAds : ['ad1'];

    // Suppress loops
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            if (/ResizeObserver/.test(args[0])) return;
            originalError.call(console, ...args);
        };
        return () => { console.error = originalError; };
    }, []);

    // Rotator
    useEffect(() => {
        if (activeTab !== 'v-home') return;
        const interval = setInterval(() => {
            setActiveAd(prev => (prev + 1) % adsToRender.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeTab, adsToRender.length]);

    // SCANNER LOGIC
    const processImage = async (file: File) => {
        setScanning(true);
        try {
            const worker = await createWorker('eng');
            const ret = await worker.recognize(file);
            const text = ret.data.text;
            await worker.terminate();

            const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
            const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gi;

            const emails = text.match(emailRegex) || [];
            const phones = text.match(phoneRegex) || [];
            const lines = text.split('\n').filter(l => l.trim().length > 2);
            const potentialName = lines.find(l => !l.match(emailRegex) && !l.match(phoneRegex)) || "Unknown Name";

            setScanResult({
                name: potentialName.substring(0, 30),
                email: emails[0] || '',
                phone: phones[0] || '',
                notes: text.substring(0, 100) + '...'
            });

        } catch (err) {
            alert('Scan Failed. Try again.');
            console.error(err);
        } finally {
            setScanning(false);
        }
    };

    const saveLead = () => {
        if (!scanResult) return;
        const newLeads = [...scannedContacts, { ...scanResult, date: new Date().toISOString() }];
        setScannedContacts(newLeads);
        localStorage.setItem('tapos_leads', JSON.stringify(newLeads));
        setScanResult(null);
    };

    const downloadCSV = () => {
        if (scannedContacts.length === 0) return alert('No leads to export.');
        const headers = ["Name", "Email", "Phone", "Notes", "Date"];
        const rows = scannedContacts.map(c => [c.name, c.email, c.phone, `"${c.notes.replace(/\n/g, ' ')}"`, c.date]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tapos_leads.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (!data) return <div className="text-white text-center mt-20">Card Protocol Not Found.</div>;

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Rajdhani:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
            <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />

            <style>{IMPULSO_STYLES}</style>

            <div className="impulso-wrapper">
                <div className="bg-gradient-radial"></div>

                <div id="tap-os-engine">

                    {/* HEADER */}
                    <div className="header-zone">
                        <div className="profile-pill">
                            <div className="avatar-wrap">
                                <img src={data.profileImage || "https://placehold.co/100x100"} className="avatar-img" />
                                <div className="online-dot"></div>
                            </div>
                            <div className="char-info">
                                <h1>{data.fullName}</h1>
                                <span>{data.jobTitle}</span>
                            </div>
                        </div>
                        <div className="sys-icons" style={{ color: 'var(--gold)', fontWeight: '800', letterSpacing: '2px', fontSize: '0.9rem', fontFamily: 'Rajdhani' }}>
                            TAPOS
                        </div>
                    </div>

                    {/* MARQUEE */}
                    <div className="marquee-container">
                        <div className="marquee-content">
                            {[1, 2, 3, 4].map(k => (
                                <span key={k}>
                                    <span className="m-item">{data.marqueeText || `🚀 ${data.company || "TAPOS SYSTEM"} LAUNCHED`}</span><span className="m-item">•</span>
                                    <span className="m-item">{data.marqueeText ? "" : `CONNECT WITH ${data.fullName}`}</span><span className="m-item">•</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* VIEWPORT */}
                    <div className="viewport">

                        {/* VIEW 1: HOME */}
                        <div className={`view-pane justify-center items-center ${activeTab === 'v-home' ? 'active' : ''}`}>
                            <div className="ad-container">
                                {adsToRender.map((key, idx) => {
                                    // SPECIAL: FIRST CARD IS LOGO IF AVAILABLE
                                    if (idx === 0 && data.logoImage) {
                                        return (
                                            <div key={key} className={`ad-card ${activeAd === idx ? 'show' : ''}`} style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
                                                <div className="notify-badge"><i className="ph-fill ph-check-circle pulse-bell"></i> VERIFIED</div>
                                                <img src={data.logoImage} alt="Brand Logo" style={{ width: '80%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }} />
                                                <div className="ad-title" style={{ marginTop: 20 }}><span>{data.company || "OFFICIAL PARTNER"}</span></div>
                                            </div>
                                        );
                                    }

                                    // STANDARD AD CARD
                                    const ad = data[key] || {};
                                    const badge = ad.badge || (idx === 0 ? "SYSTEM ALERT" : idx === 1 ? "CONNECT" : "URGENT");
                                    const t1 = ad.title1 || (idx === 0 ? "DISCOVER" : idx === 1 ? "DIRECT" : "BOOK");
                                    const t2 = ad.title2 || (idx === 0 ? "MY WORK" : idx === 1 ? "ACCESS" : "CALL");
                                    const btnLabel = ad.btnLabel || (idx === 0 ? "VIEW PORTFOLIO" : idx === 1 ? "TEXT ME NOW" : "CALL OFFICE");
                                    const link = ad.link || "#";

                                    const icons = ["ph-briefcase", "ph-chat-circle-text", "ph-phone-call", "ph-star", "ph-gift"];
                                    const colors = ["#ffffff", "var(--gold)", "var(--accent)", "#ff0055", "#00ff88"];
                                    const icon = icons[idx % icons.length];
                                    const iconColor = colors[idx % colors.length];

                                    return (
                                        <div key={key} className={`ad-card ${activeAd === idx ? 'show' : ''}`}>
                                            <div className="notify-badge"><i className={`ph-fill ${idx === 0 ? 'ph-bell' : 'ph-lightning'} pulse-bell`}></i> {badge}</div>
                                            <div className="ad-title">{t1}<br /><span>{t2}</span></div>
                                            <i className={`ph-fill ${icon} ad-icon-lg`} style={{ color: iconColor }}></i>
                                            <a href={link} target="_blank" className="urgent-btn">{btnLabel}</a>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* VIEW 2: GRID */}
                        <div className={`view-pane ${activeTab === 'v-grid' ? 'active' : ''}`} style={{ overflowY: 'auto', paddingBottom: 20 }}>
                            <div className="velocity-container">
                                <div className="velocity-track">
                                    {[1, 2, 3, 4].map(k => (
                                        <div key={k} className="flex gap-4">
                                            {data.phone && <a href={`tel:${data.phone}`} className="soc-pill" style={{ borderColor: '#00ff88', color: '#fff' }}><i className="ph-fill ph-phone" style={{ color: '#00ff88' }}></i> Call</a>}
                                            {data.phone && <a href={`sms:${data.phone}`} className="soc-pill" style={{ borderColor: '#00d2ff', color: '#fff' }}><i className="ph-fill ph-chat-circle-text" style={{ color: '#00d2ff' }}></i> SMS</a>}
                                            {data.email && <a href={`mailto:${data.email}`} className="soc-pill" style={{ borderColor: '#ffa500', color: '#fff' }}><i className="ph-fill ph-envelope" style={{ color: '#ffa500' }}></i> Email</a>}
                                            {data.social_instagram && <a href={data.social_instagram} target="_blank" className="soc-pill" style={{ borderColor: '#E1306C' }}><i className="ph-fill ph-instagram-logo"></i> Instagram</a>}
                                            {data.social_facebook && <a href={data.social_facebook} target="_blank" className="soc-pill" style={{ borderColor: '#1877F2' }}><i className="ph-fill ph-facebook-logo"></i> Facebook</a>}
                                            {data.social_linkedin && <a href={data.social_linkedin} target="_blank" className="soc-pill" style={{ borderColor: '#0077B5' }}><i className="ph-fill ph-linkedin-logo"></i> LinkedIn</a>}
                                            {data.social_tiktok && <a href={data.social_tiktok} target="_blank" className="soc-pill" style={{ borderColor: '#fff' }}><i className="ph-fill ph-tiktok-logo"></i> TikTok</a>}
                                            {data.social_threads && <a href={data.social_threads} target="_blank" className="soc-pill" style={{ borderColor: '#fff' }}><i className="ph-fill ph-at"></i> Threads</a>}
                                            {data.social_x && <a href={data.social_x} target="_blank" className="soc-pill"><i className="ph-fill ph-x-logo"></i> X</a>}
                                            {data.social_snapchat && <a href={data.social_snapchat} target="_blank" className="soc-pill" style={{ borderColor: '#FFFC00', color: '#FFFC00' }}><i className="ph-fill ph-snapchat-logo"></i> Snap</a>}
                                            {!data.phone && !data.email && !data.website && !data.social_instagram && (
                                                <span className="soc-pill" style={{ opacity: 0.5, borderColor: 'rgba(255,255,255,0.2)' }}>TAPOS IMPULSO • CONNECT</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="px-4">
                                {['srv1', 'srv2', 'srv3', 'srv4'].map((key, idx) => {
                                    const srv = data[key] || {};
                                    const title = srv.title || (idx === 0 ? "Visit Website" : idx === 1 ? "My Services" : idx === 2 ? "Book Call" : "More Info");
                                    const subtitle = srv.subtitle || (idx === 0 ? "Verify Domain" : idx === 1 ? "View Offerings" : idx === 2 ? "Schedule Now" : "Download Assets");
                                    const link = srv.link || "#";
                                    const defaultIcon = idx === 0 ? "ph-globe" : idx === 1 ? "ph-briefcase" : idx === 2 ? "ph-phone" : "ph-info";
                                    const icon = getSmartIcon(title + " " + subtitle, defaultIcon);
                                    const color = idx === 1 ? "var(--accent)" : idx === 2 ? "var(--gold)" : "#fff";

                                    return (
                                        <a key={key} href={link} target="_blank" className="srv-btn">
                                            <i className={`ph ${icon} btn-icon`} style={{ color: color }}></i>
                                            <div className="btn-txt">
                                                <h3>{title}</h3>
                                                <p>{subtitle}</p>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        </div>

                        {/* VIEW 3: VIDEO */}
                        <div className={`view-pane justify-center ${activeTab === 'v-star' ? 'active' : ''}`}>
                            <div className="video-frame">
                                <iframe src={`https://www.youtube.com/embed/${data.youtubeId || 'dQw4w9WgXcQ'}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </div>

                        {/* VIEW 4: QR */}
                        <div className={`view-pane justify-center items-center ${activeTab === 'v-qr' ? 'active' : ''}`}>
                            <div className="bg-white p-6 rounded-2xl">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://tapos.com/${slug}`} alt="QR Code" />
                            </div>
                        </div>

                        {/* VIEW 5: SCANNER */}
                        <div className={`view-pane items-center ${activeTab === 'v-scan' ? 'active' : ''}`} style={{ overflowY: 'auto' }}>
                            <div className="w-full h-full p-4 flex flex-col gap-4">
                                <div className="text-center mb-2">
                                    <h2 className="font-syncopate text-neon-blue text-xl font-bold">LEAD SCANNER</h2>
                                    <p className="text-xs text-white/50">AI OPTICAL RECOGNITION ONLINE</p>
                                </div>

                                {!scanResult ? (
                                    <>
                                        {/* CAMERA TRIGGER */}
                                        <div className="flex justify-center py-6">
                                            <label className="scan-btn relative group">
                                                {scanning ? <Loader2 className="animate-spin text-black" /> : <i className="ph-fill ph-camera text-2xl text-black"></i>}
                                                <input type="file" accept="image/*" capture="environment"
                                                    onChange={(e) => e.target.files && processImage(e.target.files[0])}
                                                    className="hidden" disabled={scanning} />
                                            </label>
                                        </div>
                                        <p className="text-center text-xs text-white/40 mb-4">Tap Camera to Scan Business Card</p>

                                        {/* LIST */}
                                        <div className="flex-1 overflow-auto space-y-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-white uppercase">Saved Leads ({scannedContacts.length})</span>
                                                <button onClick={downloadCSV} className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                                                    EXPORT CSV
                                                </button>
                                            </div>
                                            {scannedContacts.map((lead, i) => (
                                                <div key={i} className="scan-list-item">
                                                    <div className="font-bold text-white text-sm">{lead.name}</div>
                                                    <div className="text-xs text-gray-400">{lead.email}</div>
                                                    <div className="text-xs text-gray-400">{lead.phone}</div>
                                                </div>
                                            ))}
                                            {scannedContacts.length === 0 && <div className="text-center text-xs text-white/20 py-4">No leads saved yet.</div>}
                                        </div>
                                    </>
                                ) : (
                                    /* EDIT RESULT FORM */
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 animate-in fade-in">
                                        <h3 className="text-sm font-bold text-gold uppercase">Confirm Details</h3>

                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">Name</label>
                                            <input type="text" value={scanResult.name} onChange={e => setScanResult({ ...scanResult, name: e.target.value })}
                                                className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:border-accent outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">Email</label>
                                            <input type="text" value={scanResult.email} onChange={e => setScanResult({ ...scanResult, email: e.target.value })}
                                                className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:border-accent outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase">Phone</label>
                                            <input type="text" value={scanResult.phone} onChange={e => setScanResult({ ...scanResult, phone: e.target.value })}
                                                className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:border-accent outline-none" />
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button onClick={() => setScanResult(null)} className="flex-1 bg-white/10 p-2 rounded text-xs font-bold text-white uppercase">Cancel</button>
                                            <button onClick={saveLead} className="flex-1 bg-neon-blue text-black p-2 rounded text-xs font-bold uppercase shadow-[0_0_15px_rgba(0,243,255,0.4)]">Save Lead</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* DOCK */}
                    <div className="dock-zone">
                        <nav className="dock">
                            <div className={`d-icon ${activeTab === 'v-home' ? 'active' : ''}`} onClick={() => setActiveTab('v-home')}>
                                <i className="ph-fill ph-house"></i>
                            </div>
                            <div className={`d-icon ${activeTab === 'v-grid' ? 'active' : ''}`} onClick={() => setActiveTab('v-grid')}>
                                <i className="ph-fill ph-squares-four"></i>
                                {activeTab !== 'v-grid' && <div className="notify-dot" style={{ right: -2, top: 0 }}></div>}
                            </div>

                            {/* SCANNER */}
                            <div className={`d-icon ${activeTab === 'v-scan' ? 'active' : ''}`} onClick={() => setActiveTab('v-scan')}>
                                <i className="ph-fill ph-camera"></i>
                            </div>

                            <div className={`d-icon ${activeTab === 'v-star' ? 'active' : ''}`} onClick={() => setActiveTab('v-star')}>
                                <i className="ph-fill ph-star"></i>
                            </div>
                            <div className={`d-icon ${activeTab === 'v-qr' ? 'active' : ''}`} onClick={() => setActiveTab('v-qr')}>
                                <i className="ph-fill ph-qr-code"></i>
                            </div>

                            {/* SAVE VCF */}
                            <div className="d-icon save" onClick={() => {
                                const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.fullName || 'TapOS User'}
ORG:${data.company || 'TapOS'}
TITLE:${data.jobTitle || ''}
TEL;TYPE=CELL:${data.phone || ''}
EMAIL:${data.email || ''}
URL:${data.website || `https://tapos.com/${slug}`}
NOTE:Powered by TapOS Impulso
END:VCARD`;
                                const blob = new Blob([vcard], { type: 'text/vcard' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = `${data.fullName || 'contact'}.vcf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                            }}>
                                <i className="ph-bold ph-download-simple"></i>
                            </div>
                        </nav>
                        <div className="footer-legal" style={{ opacity: 0.5, fontSize: '10px', textAlign: 'center' }}>
                            2020-2026 Tap & Go 360©<br />
                            Powered by <a href="https://jsdigitalhub.com/" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>JS Digital Hub</a> | <a href="https://tapygo.com/" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>Tap & GO</a>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
