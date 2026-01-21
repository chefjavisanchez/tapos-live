'use client';

import ExchangeModal from './ExchangeModal';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';

import { Loader2, Edit } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { supabase } from '@/lib/supabase';

const IMPULSO_STYLES = `
  :root {
      --gold: #00f3ff; /* OVERRIDE: NEON BLUE */
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
      background: radial-gradient(circle at 50% 15%, rgba(0, 243, 255, 0.15), transparent 60%);
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
      text-shadow: 0 0 20px rgba(0, 243, 255, 0.4); 
  }
  
  .ad-icon-lg { font-size: 4rem; margin-bottom: 25px; opacity: 0.8; }
  
  .urgent-btn {
      background: var(--gold); color: #000; text-decoration: none;
      padding: 16px 30px; border-radius: 50px;
      font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 1rem;
      margin-top: auto; box-shadow: 0 0 20px rgba(0, 243, 255, 0.4);
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
    ownerId?: string;
    cardId?: string;
}

export default function CardEngine({ data, slug, ownerId, cardId }: CardEngineProps) {
    const searchParams = useSearchParams();
    const initialView = searchParams.get('view') || 'v-home';
    const [activeTab, setActiveTab] = useState(initialView);
    const [activeAd, setActiveAd] = useState(0);

    // Theme State - Default to Dark
    const [isDarkMode, setIsDarkMode] = useState(true);
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const dynamicStyles = `
      :root {
          --bg-main: ${isDarkMode ? '#000000' : '#f0f2f5'};
          --bg-card: ${isDarkMode ? '#000000' : '#ffffff'};
          --text-main: ${isDarkMode ? '#ffffff' : '#1a1a1a'};
          --text-muted: ${isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
          --glass-panel: ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
          --border-light: ${isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)'};
          --gold: ${isDarkMode ? '#00f3ff' : '#007075'};
      }
      
      .impulso-wrapper {
          color: var(--text-main) !important;
          background: var(--bg-main) !important;
      }

      #tap-os-engine {
          background: var(--bg-card) !important;
          border-left: 1px solid ${isDarkMode ? '#222' : '#e5e5e5'};
          border-right: 1px solid ${isDarkMode ? '#222' : '#e5e5e5'};
          color: var(--text-main);
      }

      .profile-pill {
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)'};
          border: var(--border-light);
          color: var(--text-main);
      }
      
      .profile-pill span {
          color: var(--text-muted);
      }

      .service-btn h3 { color: var(--text-main) !important; }
      .service-btn p { color: var(--text-muted) !important; }
      
      /* FIX: Explicitly color the name H1 to adapt to light mode */
      .char-info h1 {
          color: var(--text-main) !important;
      }
      
      .ad-card {
          width: 92%; /* WIDER */
          aspect-ratio: 4/5;
          background: var(--bg-card);
          border-radius: 30px;
          border: var(--border-light);
          position: absolute;
          /* FIX: CENTERING LOGIC */
          left: 0;
          right: 0;
          margin: auto;
          /* ------------------ */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px; /* LESS PADDING = MORE TEXT SPACE */
          text-align: center;
          transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          opacity: 0;
          transform: scale(0.9) translateY(20px);
          pointer-events: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      }
      
      .ad-card.show {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
          z-index: 5;
      }
      
      /* Invert text colors mostly, but keep specific colored elements */
      .ad-card h2, .ad-card h3, .ad-card h4 {
          color: var(--text-main);
      }
      
      .ad-card p {
          color: var(--text-muted);
      }
      /* Invert icons in light mode if needed */
      ${!isDarkMode ? '.ph-fill { filter: brightness(0.8); }' : ''}
    `;

    // SCANNER STATE
    const [scannedContacts, setScannedContacts] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);
    const [isOwner, setIsOwner] = useState(false);

    // HANDLERS

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
            // 1. Convert to Base64 (needed for both OpenAI and local display mostly)
            const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
            const base64Image = await toBase64(file);

            // 2. Check for Turbo Mode
            if (data.openai_api_key && data.openai_api_key.startsWith('sk-')) {
                console.log("🚀 Using AI Turbo Scan...");
                const res = await fetch('/api/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image, apiKey: data.openai_api_key })
                });

                if (!res.ok) throw new Error('AI Scan Failed');

                const aiData = await res.json();
                setScanResult({
                    name: aiData.name || '',
                    email: aiData.email || '',
                    phone: aiData.phone || '',
                    notes: aiData.notes || 'Scanned with GPT-4 Vision'
                });

            } else {
                // 3. Fallback to Local Tesseract
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
            }

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
        document.body.removeChild(link);
    };

    const handleSaveContact = () => {
        setExchangeMode(true);
    };

    // EXCHANGE MODE STATE
    const [exchangeMode, setExchangeMode] = useState(false);

    if (!data) return <div className="text-white text-center mt-20">Card Protocol Not Found.</div>;

    const handleExchangeSubmit = (formData: { name: string; email: string; phone: string }) => {
        // 1. Save their info locally (simulated lead capture)
        const newLead = { ...formData, date: new Date().toISOString(), notes: 'Exchanged via TapOS' };
        const saved = JSON.parse(localStorage.getItem('tapos_leads') || '[]');
        localStorage.setItem('tapos_leads', JSON.stringify([...saved, newLead]));

        // 2. Download our VCF
        downloadVcf();

        // 3. Close & Reset
        alert(`Shared! You received ${data.fullName}'s card and we saved your info.`);
        setExchangeMode(false);
    };

    const downloadVcf = async () => {
        let photoBase64 = '';
        if (data.profileImage) {
            try {
                const response = await fetch(data.profileImage);
                const blob = await response.blob();
                const reader = new FileReader();
                photoBase64 = await new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        const res = reader.result as string;
                        const base64 = res.split(',')[1];
                        resolve(base64);
                    };
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                console.error("Failed to load profile image for VCF", e);
            }
        }

        const fullName = data.fullName || 'Contact';
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const vcard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fullName}
TITLE:${data.jobTitle || ''}
ORG:${data.company || ''}
TEL:${data.phone || ''}
EMAIL:${data.email || ''}
URL:${typeof window !== 'undefined' ? window.location.href : ''}
NOTE:Connected via TapOS
${photoBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}` : ''}
END:VCARD`;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.fullName || 'contact'}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div id="card-engine-root">
            <ExchangeModal
                visible={exchangeMode}
                onClose={() => setExchangeMode(false)}
                onExchange={handleExchangeSubmit}
                onSkip={downloadVcf}
                cardData={data}
            />


            <style dangerouslySetInnerHTML={{ __html: IMPULSO_STYLES }} />
            <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
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

                        <div className="flex gap-2">
                            <button
                                onClick={toggleTheme}
                                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition hover:scale-105 active:scale-95"
                                style={{
                                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                    border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)'
                                }}
                            >
                                <i className={`ph-fill ${isDarkMode ? 'ph-sun-dim' : 'ph-moon-stars'}`}
                                    style={{ color: isDarkMode ? '#fbbf24' : '#64748b', fontSize: '20px' }}></i>
                            </button>

                            {isOwner && (
                                <a href={`/editor?id=${cardId}`} className="w-10 h-10 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center animate-pulse hover:animate-none transition">
                                    <Edit size={16} className="text-neon-blue" />
                                </a>
                            )}
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

                            {/* DYNAMIC SERVICE BUTTONS */}
                            {[1, 2, 3, 4].map((srv) => {
                                const srvKey = `srv${srv}`; // Construct key: srv1, srv2...
                                const btnData = data[srvKey] || {}; // Access correct key
                                const defaultLabels = { 1: 'Visit Website', 2: 'My Offerings', 3: 'WhatsApp', 4: 'More Info' };
                                const defaultIcons = { 1: 'ph-globe', 2: 'ph-briefcase', 3: 'ph-whatsapp-logo', 4: 'ph-info' };
                                const isWhatsApp = srv === 3; // Special check for button 3

                                return (
                                    <a
                                        key={srv}
                                        href={btnData?.link || '#'}
                                        target="_blank"
                                        onClick={(e) => {
                                            if (!btnData?.link || btnData.link === '#') {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`service-btn glass-panel ${(!btnData?.link || btnData.link === '#') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="icon-box" style={{
                                            background: isWhatsApp ? 'rgba(37, 211, 102, 0.1)' : undefined,
                                            borderColor: isWhatsApp ? 'rgba(37, 211, 102, 0.3)' : undefined
                                        }}>
                                            <i className={`ph-fill ${isWhatsApp ? 'ph-whatsapp-logo' : (btnData?.icon || defaultIcons[srv as keyof typeof defaultIcons])}`} style={{
                                                color: isWhatsApp ? '#25D366' : undefined
                                            }}></i>
                                        </div>
                                        <div className="text-content">
                                            <h3>{btnData?.title || defaultLabels[srv as keyof typeof defaultLabels]}</h3>
                                            <p>{btnData?.subtitle || 'Tap to view'}</p>
                                        </div>
                                        <div className="arrow-box">
                                            <i className="ph-bold ph-arrow-right"></i>
                                        </div>
                                    </a>
                                );
                            })}

                            {/* PERMANENT REFERRAL BUTTON (BUTTON 5) */}
                            <a
                                href={`https://tapos360.com/create?ref=${slug}`}
                                target="_blank"
                                className="service-btn glass-panel"
                                style={{
                                    border: '1px dashed rgba(0, 243, 255, 0.3)',
                                    background: 'rgba(0, 243, 255, 0.03)'
                                }}
                            >
                                <div className="icon-box" style={{ background: 'rgba(0, 243, 255, 0.1)', borderColor: 'rgba(0, 243, 255, 0.3)' }}>
                                    <i className="ph-fill ph-crown" style={{ color: '#00F3FF' }}></i>
                                </div>
                                <div className="text-content">
                                    <h3 style={{ color: '#00F3FF' }}>Get Your Own</h3>
                                    <p>Create a card like this</p>
                                </div>
                                <div className="arrow-box">
                                    <i className="ph-bold ph-plus" style={{ color: '#00F3FF' }}></i>
                                </div>
                            </a>
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
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://tapos360.com/${slug}`} alt="QR Code" />
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
                            <div className="d-icon save" onClick={handleSaveContact}>
                                <i className="ph-bold ph-download-simple"></i>
                            </div>
                        </nav>
                        <div className="footer-legal" style={{ opacity: 0.5, fontSize: '10px', textAlign: 'center' }}>
                            Copyright © 2026 TapOS Impulsó. All Rights Reserved.
                        </div>
                    </div>

                </div>

            </div>

            {isOwner && (
                <a href={`/editor?id=${cardId || ''}`} className="fixed top-4 right-4 z-[9999] bg-neon-blue text-black px-4 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center gap-2 text-xs uppercase tracking-wider hover:scale-105 transition animate-in fade-in slide-in-from-top-4">
                    <Edit size={14} /> Edit Profile
                </a>
            )}
        </div>
    );
}
