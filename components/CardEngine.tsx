'use client';

import ExchangeModal from './ExchangeModal';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';

import { Loader2, Edit, Briefcase } from 'lucide-react';
// import { createWorker } from 'tesseract.js'; // Dynamic Import now
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// CRITICAL FIX: React Error 31 Protection
// This function ensures we never render an object as a React Child
const safeStr = (val: any): string => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    return ''; // Return empty string if object, null, or undefined
};

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
      background: var(--glass-panel); 
      border-radius: 30px;
      border: var(--border-light); 
      color: var(--text-main); text-decoration: none;
      font-size: 0.8rem; font-weight: 600; white-space: nowrap; flex-shrink: 0;
      transition: all 0.2s ease;
  }
  .soc-pill:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }

  .srv-btn {
      display: flex; align-items: center; gap: 15px; padding: 15px;
      margin-bottom: 10px; background: var(--glass-panel);
      border: var(--border-light); border-radius: 16px;
      text-decoration: none; color: var(--text-main); transition: 0.2s; flex-shrink: 0;
  }
  .srv-btn:active { transform: scale(0.98); opacity: 0.8; }
  
  .btn-icon { font-size: 1.8rem; color: var(--gold); }
  .text-content h3 { margin: 0; font-family: 'Rajdhani', sans-serif; font-size: 1.1rem; color: var(--text-main); }
  .text-content p { margin: 0; font-size: 0.7rem; color: var(--text-muted); }

  /* DOCK */
  .dock-zone { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding-bottom: 20px; }
  .dock {
      background: var(--glass-panel); backdrop-filter: blur(20px);
      border: var(--border-light); padding: 10px 20px; border-radius: 40px;
      display: flex; gap: 24px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      margin-bottom: 15px;
  }
  .d-icon { font-size: 1.5rem; color: var(--text-muted); transition: 0.3s; position: relative; cursor: pointer; }
  .d-icon.active { color: var(--text-main); transform: translateY(-4px); }
  
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
      border: 2px solid var(--bg-card);
  }
  .scan-list-item {
      background: var(--glass-panel);
      border: var(--border-light);
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
      opacity: 0 !important;
      pointer-events: none !important;
  }
  
  /* IMMERSIVE MODE STYLES */
  .header-zone, .dock-zone {
      transition: opacity 0.5s ease, transform 0.5s ease;
      opacity: 1;
      transform: translateY(0);
  }
  
  .ui-hidden .header-zone {
      opacity: 0;
      transform: translateY(-20px);
      pointer-events: none;
  }
  
  .ui-hidden .dock-zone {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
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
    remoteLeads?: any[];
}

// Temporary mock data for the Services Showcase before Admin DB is connected
const defaultServices = [
    {
        title: "Leaking Faucet Repair",
        description: "Diagnose leak, replace washers/cartridge, tighten connections",
        price: "$149",
        icon: "Wrench",
        actionUrl: "#"
    },
    {
        title: "Clogged Drain Cleaning",
        description: "Clear sink/tub/shower clog, basic snaking, flow test",
        price: "$129",
        icon: "Droplets",
        actionUrl: "#"
    },
    {
        title: "Toilet Repair",
        description: "Fix running or leaking toilet, replace flapper/fill valve",
        price: "$179",
        icon: "Wrench",
        actionUrl: "#"
    },
    {
        title: "Toilet Unclogging",
        description: "Clear blockage, auger use, restore normal flushing",
        price: "$149",
        icon: "Droplets",
        actionUrl: "#"
    }
];

export default function CardEngine({ data, slug, ownerId, cardId, remoteLeads = [] }: CardEngineProps) {
    const searchParams = useSearchParams();

    // ANALYTICS TRACKING
    // ANALYTICS TRACKING
    const trackSave = () => {
        if (!cardId) return;
        fetch('/api/card/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId, type: 'save' })
        }).catch(e => console.error("Analytics Save Error", e));
    };

    useEffect(() => {
        // VIEW ANALYTIC
        // We use sessionStorage to prevent duplicate views in one session
        if (cardId && !sessionStorage.getItem(`viewed_${cardId}`)) {
            fetch('/api/card/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId, type: 'view' })
            }).catch(e => console.error("Analytics View Error", e));
            sessionStorage.setItem(`viewed_${cardId}`, 'true');
        }
    }, [cardId]);

    // HYDRATION FIX: Default to 'v-home' on server/initial render
    const [activeTab, setActiveTab] = useState('v-home');

    // Sync with URL after mount (Client Only)
    useEffect(() => {
        const view = searchParams.get('view');
        if (view) setActiveTab(view);
    }, [searchParams]);

    const [activeAd, setActiveAd] = useState(0);

    // IMMERSIVE MODE STATE
    const [isUIHidden, setIsUIHidden] = useState(false);
    const IDLE_TIMEOUT = 4000; // 4 seconds

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const resetTimer = () => {
            setIsUIHidden(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsUIHidden(true);
            }, IDLE_TIMEOUT);
        };

        // Initial set
        resetTimer();

        // Listeners
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, []);

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
          --border-light: ${isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.2)'};
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

      /* PREMIUM AD STYLES */
      .ad-card.premium-ad {
          padding: 2px; /* thickness of the border */
          background: transparent;
          border: none;
          overflow: hidden;
      }
      .ad-card.premium-ad::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: conic-gradient(transparent, transparent, transparent, var(--gold));
          animation: sweep-border 4s linear infinite;
          z-index: 0;
      }
      @keyframes sweep-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
      .ad-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--bg-card);
          border-radius: 28px; /* Slightly less than the outer 30px to fit perfectly */
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px;
          box-sizing: border-box;
      }
      .premium-badge {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 6px 24px;
          font-size: 16px;
          color: var(--text-muted);
          margin-bottom: 15px;
          background: rgba(255,255,255,0.05);
      }
      ${!isDarkMode ? `
      .premium-badge {
          border: 1px solid rgba(0,0,0,0.2);
          background: rgba(0,0,0,0.05);
      }
      ` : ''}
      .premium-title {
          font-size: 26px;
          font-weight: 500;
          color: var(--text-main);
          text-align: center;
          margin-bottom: 8px;
          line-height: 1.2;
      }
      .premium-subtitle {
          font-size: 16px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.4;
          margin-bottom: 15px;
      }
      .premium-image-wrapper {
          flex-grow: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-height: 0; /* Flexbox trick to allow shrinking */
          margin-bottom: 15px;
      }
      .premium-image-wrapper img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
      }
      .premium-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: auto;
      }
      .premium-btn {
          background: var(--gold);
          color: #000;
          font-weight: bold;
          font-size: 16px;
          padding: 10px 22px;
          border-radius: 30px;
          white-space: nowrap;
          text-decoration: none;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
      }
      .premium-ad-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
      }
      .premium-ad-indicator strong {
          font-size: 24px;
          color: var(--text-main);
          font-weight: bold;
          line-height: 1;
      }
      .premium-dots {
          display: flex;
          gap: 6px;
      }
      .premium-dots span {
          width: 8px; height: 8px;
          background: var(--text-main);
          border-radius: 50%;
          opacity: 0.2;
      }
      .premium-dots span.active {
          opacity: 1;
      }
    `;

    // SCANNER STATE
    const [scannedContacts, setScannedContacts] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);
    const [isOwner, setIsOwner] = useState(false);

    // SERVICES STATE
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    // HANDLERS

    useEffect(() => {
        // 1. Load Local Storage (Scanning History)
        const saved = localStorage.getItem('tapos_leads');
        const localLeads = saved ? JSON.parse(saved) : [];

        // 2. Load Cloud SQL Leads
        const cloudLeads = remoteLeads || [];

        // 3. Merge and deduplicate
        const allLeads = [...localLeads, ...cloudLeads];

        // Unique by combining phone and email checks, fallback to date to avoid duplicating identical leads 
        // that exist in both local storage and cloud database.
        const uniqueLeads = allLeads.filter((v: any, i: number, a: any) =>
            a.findIndex((t: any) =>
                (t.email && t.email === v.email) ||
                (t.phone && t.phone === v.phone) ||
                (t.date && t.date === v.date)
            ) === i
        );

        setScannedContacts(uniqueLeads);
    }, [remoteLeads]);

    // Calculate valid ads
    const allAds = ['ad1', 'ad2', 'ad3', 'ad4', 'ad5'];
    const validAds = allAds.filter((key, idx) => idx === 0 || (data?.[key] && data?.[key]?.title1));
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
        }, 3000);
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
            if (data?.openai_api_key && data?.openai_api_key.startsWith('sk-')) {
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
                // 3. Fallback to Local Tesseract (Dynamic Import)
                // @ts-ignore
                const Tesseract = await import('tesseract.js');
                const worker = await Tesseract.createWorker('eng');
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

    const saveLead = async () => {
        if (!scanResult) return;

        // 1. Save to Cloud (Supabase)
        try {
            await fetch('/api/card/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId,
                    ownerId,
                    name: scanResult.name,
                    email: scanResult.email,
                    phone: scanResult.phone,
                    note: `Scanned: ${scanResult.notes}`
                })
            });
        } catch (e) {
            console.error("Cloud Save Failed (Scanner)", e);
        }

        // 2. Save locally as backup & update UI
        const newLeads = [...scannedContacts, { ...scanResult, date: new Date().toISOString() }];
        setScannedContacts(newLeads);
        localStorage.setItem('tapos_leads', JSON.stringify(newLeads));

        alert("Lead Saved! Synced to your database.");
        setScanResult(null);
    };

    const clearLeads = () => {
        if (!confirm('Are you sure you want to delete all scanned leads from this device?')) return;
        setScannedContacts([]);
        localStorage.removeItem('tapos_leads');
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

        // Automatically clear after download as requested
        setTimeout(() => {
            setScannedContacts([]);
            localStorage.removeItem('tapos_leads');
        }, 1000);
    };

    const handleSaveContact = () => {
        setExchangeMode(true);
    };

    // EXCHANGE MODE STATE
    const [exchangeMode, setExchangeMode] = useState(false);

    // NEW: Success State
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!data) return <div className="text-white text-center mt-20">Card Protocol Not Found.</div>;

    const handleExchangeSubmit = async (formData: { name: string; email: string; phone: string }) => {
        // 1. Send to Server (Supabase + GHL Trigger)
        try {
            await fetch('/api/card/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId,
                    ownerId,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    note: 'Exchanged via TapOS Card'
                })
            });
        } catch (e) {
            console.error("Cloud Save Failed", e);
        }

        // 2. Save locally as backup
        const newLead = { ...formData, date: new Date().toISOString(), notes: 'Exchanged via TapOS' };
        const saved = JSON.parse(localStorage.getItem('tapos_leads') || '[]');
        localStorage.setItem('tapos_leads', JSON.stringify([...saved, newLead]));

        // 3. Download our VCF and Track
        downloadVcf();
        trackSave();

        // 4. Show Success State (No Alerts!)
        setIsSubmitted(true);
        // Optional: Reset after a delay or keep success screen?
        // Let's keep success screen for 3 seconds then close
        setTimeout(() => {
            setExchangeMode(false);
            setIsSubmitted(false);
        }, 3000);
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

        // Track the save event in our analytics
        trackSave();
    };

    return (
        <div id="card-engine-root">
            <ExchangeModal
                visible={exchangeMode}
                onClose={() => { setExchangeMode(false); setIsSubmitted(false); }}
                onExchange={handleExchangeSubmit}
                onSkip={downloadVcf}
                cardData={data}
                isSubmitted={isSubmitted}
            />

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* REMOVED DUPLICATE FONT LINKS - Handled in layout.tsx */}
            {/* REMOVED EXTERNAL SCRIPT - Handled via local package in layout.tsx */}

            <style dangerouslySetInnerHTML={{ __html: IMPULSO_STYLES }} />
            <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
            <div className="impulso-wrapper">
                <div className="bg-gradient-radial"></div>

                <div id="tap-os-engine" className={isUIHidden ? 'ui-hidden' : ''} onClick={() => setIsUIHidden(false)}>

                    {/* HEADER */}
                    <div className="header-zone">
                        <div className="profile-pill">
                            <div className="avatar-wrap">
                                <img src={data.profileImage || "https://placehold.co/100x100"} className="avatar-img" />
                                <div className="online-dot"></div>
                            </div>
                            <div className="char-info">
                                <h1>{safeStr(data.fullName)}</h1>
                                <span>{safeStr(data.jobTitle)}</span>
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

                            <button
                                onClick={() => setIsServicesOpen(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition hover:scale-105 active:scale-95 border border-gold/30"
                                style={{
                                    background: 'rgba(0, 243, 255, 0.1)',
                                }}
                            >
                                <Briefcase size={18} className="text-gold" />
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
                                    <span className="m-item">{safeStr(data.marqueeText) || `🚀 ${safeStr(data.company) || "TAPOS SYSTEM"} LAUNCHED`}</span><span className="m-item">•</span>
                                    <span className="m-item">{data.marqueeText ? "" : `CONNECT WITH ${safeStr(data.fullName)}`}</span><span className="m-item">•</span>
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
                                                <div className="ad-title" style={{ marginTop: 20 }}><span>{safeStr(data.company) || "OFFICIAL PARTNER"}</span></div>
                                            </div>
                                        );
                                    }

                                    // STANDARD AD CARD
                                    const ad = data[key] || {};
                                    const badge = ad.badge || (idx === 0 ? "SYSTEM ALERT" : "NEW");
                                    const t1 = ad.title1 || (idx === 0 ? "DISCOVER" : "");
                                    const t2 = ad.title2 || (idx === 0 ? "MY WORK" : "");
                                    const btnLabel = ad.btnLabel || (idx === 0 ? "VIEW PORTFOLIO" : "GET IT HERE");
                                    const link = ad.link || "#";
                                    const imageUrl = ad.imageUrl || ""; // NEW IMAGE URLs

                                    const icons = ["ph-briefcase", "ph-chat-circle-text", "ph-phone-call", "ph-star", "ph-gift"];
                                    const colors = ["#ffffff", "var(--gold)", "var(--accent)", "#ff0055", "#00ff88"];
                                    const icon = icons[idx % icons.length];
                                    const iconColor = colors[idx % colors.length];

                                    return (
                                        <div key={key} className={`ad-card ${idx > 0 ? 'premium-ad' : ''} ${activeAd === idx ? 'show' : ''}`}>
                                            {idx > 0 ? (
                                                <div className="ad-card-inner">
                                                    {badge && <div className="premium-badge">{safeStr(badge)}</div>}
                                                    {t1 && <div className="premium-title">{safeStr(t1)}</div>}
                                                    {t2 && <div className="premium-subtitle">{safeStr(t2)}</div>}

                                                    <div className="premium-image-wrapper">
                                                        {imageUrl ? (
                                                            <img src={imageUrl} alt="Promo" />
                                                        ) : (
                                                            <i className={`ph-fill ${icon}`} style={{ color: iconColor, fontSize: '80px' }}></i>
                                                        )}
                                                    </div>

                                                    <div className="premium-bottom-row">
                                                        <a href={link} target="_blank" className="premium-btn">{safeStr(btnLabel)}</a>
                                                        <div className="premium-ad-indicator">
                                                            <strong>Ad</strong>
                                                            <div className="premium-dots">
                                                                {[0, 1, 2, 3, 4].map(dotIdx => (
                                                                    <span key={dotIdx} className={idx === dotIdx ? 'active' : ''}></span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="notify-badge"><i className={`ph-fill ph-bell pulse-bell`}></i> {safeStr(badge)}</div>
                                                    <div className="ad-title">{safeStr(t1)}<br /><span>{safeStr(t2)}</span></div>
                                                    <i className={`ph-fill ${icon} ad-icon-lg`} style={{ color: iconColor }}></i>
                                                    <a href={link} target="_blank" className="urgent-btn">{safeStr(btnLabel)}</a>
                                                </>
                                            )}
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
                                            {data.phone && <a href={`tel:${data.phone}`} className="soc-pill" style={{ borderColor: '#00ff88', color: isDarkMode ? '#fff' : '#00b862' }}><i className="ph-fill ph-phone" style={{ color: isDarkMode ? '#00ff88' : 'inherit' }}></i> Call</a>}
                                            {data.phone && <a href={`sms:${data.phone}`} className="soc-pill" style={{ borderColor: '#00d2ff', color: isDarkMode ? '#fff' : '#0090af' }}><i className="ph-fill ph-chat-circle-text" style={{ color: isDarkMode ? '#00d2ff' : 'inherit' }}></i> SMS</a>}
                                            {data.email && <a href={`mailto:${data.email}`} className="soc-pill" style={{ borderColor: '#ffa500', color: isDarkMode ? '#fff' : '#c27c00' }}><i className="ph-fill ph-envelope" style={{ color: isDarkMode ? '#ffa500' : 'inherit' }}></i> Email</a>}
                                            {data.social_instagram && <a href={data.social_instagram} target="_blank" className="soc-pill" style={{ borderColor: '#E1306C', color: isDarkMode ? 'var(--text-main)' : '#E1306C' }}><i className="ph-fill ph-instagram-logo"></i> Instagram</a>}
                                            {data.social_facebook && <a href={data.social_facebook} target="_blank" className="soc-pill" style={{ borderColor: '#1877F2', color: isDarkMode ? 'var(--text-main)' : '#1877F2' }}><i className="ph-fill ph-facebook-logo"></i> Facebook</a>}
                                            {data.social_linkedin && <a href={data.social_linkedin} target="_blank" className="soc-pill" style={{ borderColor: '#0077B5', color: isDarkMode ? 'var(--text-main)' : '#0077B5' }}><i className="ph-fill ph-linkedin-logo"></i> LinkedIn</a>}
                                            {data.social_tiktok && <a href={data.social_tiktok} target="_blank" className="soc-pill" style={{ borderColor: isDarkMode ? '#fff' : '#000', color: isDarkMode ? 'var(--text-main)' : '#000' }}><i className="ph-fill ph-tiktok-logo"></i> TikTok</a>}
                                            {data.social_threads && <a href={data.social_threads} target="_blank" className="soc-pill" style={{ borderColor: isDarkMode ? '#fff' : '#000', color: isDarkMode ? 'var(--text-main)' : '#000' }}><i className="ph-fill ph-at"></i> Threads</a>}
                                            {data.social_x && <a href={data.social_x} target="_blank" className="soc-pill" style={{ borderColor: isDarkMode ? '#fff' : '#000', color: isDarkMode ? 'var(--text-main)' : '#000' }}><i className="ph-fill ph-x-logo"></i> X</a>}
                                            {data.social_snapchat && <a href={data.social_snapchat} target="_blank" className="soc-pill" style={{ borderColor: '#FFFC00', color: isDarkMode ? '#fff' : '#d97706' }}><i className="ph-fill ph-snapchat-logo"></i> Snap</a>}
                                            {!data.phone && !data.email && !data.website && !data.social_instagram && (
                                                <span className="soc-pill" style={{ opacity: 0.5, borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', color: 'var(--text-main)' }}>TAPOS IMPULSO • CONNECT</span>
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
                                            <h3>{safeStr(btnData?.title) || defaultLabels[srv as keyof typeof defaultLabels]}</h3>
                                            <p>{safeStr(btnData?.subtitle) || 'Tap to view'}</p>
                                        </div>
                                        <div className="arrow-box">
                                            <i className="ph-bold ph-arrow-right"></i>
                                        </div>
                                    </a>
                                );
                            })}

                            {/* PERMANENT REFERRAL BUTTON (BUTTON 5) */}
                            <a
                                href={`/?ref=${slug}`}
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
                                        <p className="text-center text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Tap Camera to Scan Business Card</p>

                                        {/* LIST */}
                                        <div className="flex-1 overflow-auto space-y-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-main)' }}>Saved Leads ({scannedContacts.length})</span>
                                                <div className="flex gap-2">
                                                    {scannedContacts.length > 0 && (
                                                        <button onClick={clearLeads} className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/30 hover:bg-red-500 hover:text-white transition">
                                                            CLEAR
                                                        </button>
                                                    )}
                                                    <button onClick={downloadCSV} className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30 hover:bg-green-500 hover:text-black transition">
                                                        EXPORT CSV
                                                    </button>
                                                </div>
                                            </div>
                                            {scannedContacts.map((lead, i) => (
                                                <div key={i} className="scan-list-item">
                                                    <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{lead.name}</div>
                                                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{lead.email}</div>
                                                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{lead.phone}</div>
                                                </div>
                                            ))}
                                            {scannedContacts.length === 0 && <div className="text-center text-xs py-4" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>No leads saved yet.</div>}
                                        </div>
                                    </>
                                ) : (
                                    /* EDIT RESULT FORM */
                                    <div className="rounded-2xl p-4 space-y-3 animate-in fade-in" style={{ background: 'var(--glass-panel)', border: 'var(--border-light)' }}>
                                        <h3 className="text-sm font-bold text-gold uppercase">Confirm Details</h3>

                                        <div>
                                            <label className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Name</label>
                                            <input type="text" value={scanResult.name} onChange={e => setScanResult({ ...scanResult, name: e.target.value })}
                                                className="w-full rounded p-2 text-sm focus:border-accent outline-none" style={{ background: 'var(--glass-panel)', border: 'var(--border-light)', color: 'var(--text-main)' }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Email</label>
                                            <input type="text" value={scanResult.email} onChange={e => setScanResult({ ...scanResult, email: e.target.value })}
                                                className="w-full rounded p-2 text-sm focus:border-accent outline-none" style={{ background: 'var(--glass-panel)', border: 'var(--border-light)', color: 'var(--text-main)' }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Phone</label>
                                            <input type="text" value={scanResult.phone} onChange={e => setScanResult({ ...scanResult, phone: e.target.value })}
                                                className="w-full rounded p-2 text-sm focus:border-accent outline-none" style={{ background: 'var(--glass-panel)', border: 'var(--border-light)', color: 'var(--text-main)' }} />
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button onClick={() => setScanResult(null)} className="flex-1 p-2 rounded text-xs font-bold uppercase" style={{ background: 'var(--glass-panel)', color: 'var(--text-main)', border: 'var(--border-light)' }}>Cancel</button>
                                            <button onClick={saveLead} className="flex-1 text-black p-2 rounded text-xs font-bold uppercase shadow-[0_0_15px_rgba(0,243,255,0.4)]" style={{ background: 'var(--gold)' }}>Save Lead</button>
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
                            {/* SCANNER */}
                            <div className={`d-icon ${activeTab === 'v-scan' ? 'active' : ''}`} onClick={() => setActiveTab('v-scan')}>
                                <i className="ph-fill ph-camera"></i>
                                {scannedContacts.length > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-black z-10 animate-bounce">
                                        {scannedContacts.length}
                                    </div>
                                )}
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

            {/* Premium Services App Drawer */}
            <AnimatePresence>
                {isServicesOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex flex-col justify-end"
                        onClick={() => setIsServicesOpen(false)}
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: '0%' }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-[480px] mx-auto bg-black/80 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col"
                            style={{ height: '85vh' }}
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside drawer
                        >
                            {/* Drawer Handle & Header */}
                            <div className="flex flex-col items-center pt-3 pb-4 sticky top-0 z-10 bg-gradient-to-b from-black/90 to-transparent">
                                <div className="w-12 h-1.5 bg-white/20 rounded-full mb-4"></div>
                                <div className="w-full px-6 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white uppercase tracking-wider font-syncopate">Showcase</h2>
                                    <button onClick={() => setIsServicesOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition">
                                        <i className="ph-bold ph-x"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Services Grid (Matches the user's reference screenshot) */}
                            <div className="flex-1 overflow-y-auto px-4 pb-10 custom-scrollbar">
                                {(!data?.content?.appServices || data.content.appServices.length === 0) ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60 mt-20">
                                        <i className="ph-light ph-folder-open text-5xl mb-4 text-[#00f3ff]"></i>
                                        <h3 className="text-white font-bold text-lg mb-2">Showcase Empty</h3>
                                        <p className="text-sm text-slate-400">Add your first custom landing page from your Admin Dashboard.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.content.appServices.map((service: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="bg-[#0b101e] border border-white/5 p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:border-[#00f3ff]/30 transition-all duration-300"
                                            >
                                                {/* Subtle Glow Effect on Hover */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                                {/* Icon */}
                                                <div className="w-10 h-10 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center mb-4">
                                                    <i className={`ph-fill ph-${service.icon || 'star'} text-[#00f3ff] text-xl`}></i>
                                                </div>

                                                {/* Content */}
                                                <h3 className="text-white font-bold text-lg mb-2">{service.title}</h3>
                                                <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1 whitespace-pre-line">
                                                    {service.description}
                                                </p>

                                                {/* Price & Action */}
                                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                                    <span className="text-2xl font-bold text-white">{service.price}</span>
                                                    <a
                                                        href={service.actionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-black hover:bg-[#111] text-white border border-white/10 text-xs font-bold px-6 py-2.5 rounded-full transition-colors focus:ring-2 focus:ring-[#00f3ff]/50"
                                                    >
                                                        Book Now
                                                    </a>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
