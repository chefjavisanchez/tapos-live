'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Phone, Globe, Image, User, Upload, CreditCard } from 'lucide-react';

// Force dynamic rendering to avoid static build errors
export const dynamic = 'force-dynamic';

export default function Editor() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-white bg-black">INITIALIZING ENGINE...</div>}>
            <EditorContent />
        </Suspense>
    );
}

function EditorContent() {
    // ... logic ...
    const searchParams = useSearchParams();
    const cardId = searchParams.get('id');
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // The master state object
    const [card, setCard] = useState<any>(null);
    const [content, setContent] = useState<any>({
        fullName: '',
        jobTitle: '',
        company: '',
        bio: '',
        email: '',
        phone: '',
        website: '',
        profileImage: '',
        // Socials
        social_instagram: '',
        social_facebook: '',
        social_linkedin: '',
        social_tiktok: '',
        social_threads: '',
        social_x: '',
        social_snapchat: '',
        marqueeText: '',
        youtubeId: '',
        // Ads Defaults
        ad1: { badge: 'SYSTEM', title1: 'TITLE', title2: 'SUBTITLE', link: '#', btnLabel: 'CLICK' },
        ad2: { badge: 'ALERT', title1: 'TITLE', title2: 'SUBTITLE', link: '#', btnLabel: 'CLICK' },
        ad3: { badge: 'NEW', title1: 'TITLE', title2: 'SUBTITLE', link: '#', btnLabel: 'CLICK' },
        ad4: { badge: 'PROMO', title1: '', title2: 'SUBTITLE', link: '#', btnLabel: 'CLICK' },
        ad5: { badge: 'EVENT', title1: '', title2: 'SUBTITLE', link: '#', btnLabel: 'CLICK' },
        // Services Defaults
        srv1: { title: 'Service 1', subtitle: 'Desc', link: '#' },
        srv2: { title: 'Service 2', subtitle: 'Desc', link: '#' },
        srv3: { title: 'Service 3', subtitle: 'Desc', link: '#' },
        srv4: { title: 'Service 4', subtitle: 'Desc', link: '#' },
        shipping: {
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });

    useEffect(() => {
        if (!cardId) return;

        const fetchCard = async () => {
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('id', cardId)
                .single();

            if (data) {
                setCard(data);
                // Merge and FORCE strings for socials
                setContent((prev: any) => ({
                    ...prev,
                    ...data.content,
                    social_instagram: data.content.social_instagram || '',
                    social_facebook: data.content.social_facebook || '',
                    social_linkedin: data.content.social_linkedin || '',
                    social_tiktok: data.content.social_tiktok || '',
                    social_threads: data.content.social_threads || '',
                    social_x: data.content.social_x || '',
                    social_snapchat: data.content.social_snapchat || '',
                    logoImage: data.content.logoImage || '',
                    shipping: data.content.shipping || prev.shipping
                }));
            }
            setLoading(false);
        };

        fetchCard();
    }, [cardId]);

    const handleSave = async () => {
        setSaving(true);

        const { error } = await supabase
            .from('cards')
            .update({ content: content })
            .eq('id', cardId);

        if (error) alert('Error saving! Check console.');

        // Refresh the iframe preview by reloading it with a cache-busting timestamp AND view persistence
        const iframe = document.getElementById('preview-frame') as HTMLIFrameElement;
        if (iframe && card?.slug) {
            // Map Editor Tabs to Preview Views
            let view = 'v-home';
            if (activeTab === 'links' || activeTab === 'services') view = 'v-grid'; // Links & Deck -> Grid
            if (activeTab === 'visuals') view = 'v-star';
            if (activeTab === 'shipping') view = 'v-qr';

            iframe.src = `/preview?id=${cardId}&t=${Date.now()}&view=${view}`;
        }

        setSaving(false);
    };

    const updateField = (field: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [field]: value }));
    };

    // IMAGE UPLOAD HANDLER
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string = 'profileImage') => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${cardId}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage (Bucket: 'avatars')
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update State
            updateField(fieldName, publicUrl);
            // alert('Image uploaded successfully!');

        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white"><Loader2 className="animate-spin" /></div>;
    if (!card) return <div className="h-screen flex items-center justify-center bg-black text-white">Card Not Found</div>;

    return (
        <div className="flex h-screen bg-black text-white font-mono overflow-hidden">

            {/* LEFT COLUMN: EDITOR SIDEBAR */}
            <div className="w-[500px] flex flex-col border-r border-white/10 relative z-20 bg-black shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/')} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                            <span className="text-xl pb-1">←</span>
                        </button>
                        <h1 className="font-bold tracking-wider text-base">
                            TAPOS IMPULSO EDITOR {card?.slug ? `[/${card.slug}]` : '[NO SLUG]'}
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-neon-blue text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        SAVE
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
                    <button onClick={() => setActiveTab('profile')} className={`flex-1 min-w-[80px] py-5 text-xs font-bold uppercase tracking-wider border-b-2 ${activeTab === 'profile' ? 'border-neon-blue text-neon-blue bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>
                        Profile
                    </button>
                    <button onClick={() => setActiveTab('links')} className={`flex-1 min-w-[80px] py-5 text-xs font-bold uppercase tracking-wider border-b-2 ${activeTab === 'links' ? 'border-neon-blue text-neon-blue bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>
                        Links
                    </button>
                    <button onClick={() => setActiveTab('ads')} className={`flex-1 min-w-[80px] py-5 text-xs font-bold uppercase tracking-wider border-b-2 ${activeTab === 'ads' ? 'border-neon-blue text-neon-blue bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>
                        Ads
                    </button>
                    <button onClick={() => setActiveTab('services')} className={`flex-1 min-w-[80px] py-5 text-xs font-bold uppercase tracking-wider border-b-2 ${activeTab === 'services' ? 'border-neon-blue text-neon-blue bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>
                        Deck
                    </button>
                    <button onClick={() => setActiveTab('visuals')} className={`flex-1 min-w-[80px] py-5 text-xs font-bold uppercase tracking-wider border-b-2 ${activeTab === 'visuals' ? 'border-neon-blue text-neon-blue bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>
                        Visuals
                    </button>
                    <button onClick={() => setActiveTab('shipping')} className={`flex-1 min-w-[80px] py-5 text-xs font-bold uppercase tracking-wider border-b-2 ${activeTab === 'shipping' ? 'border-green-400 text-green-400 bg-white/5' : 'border-transparent text-white/40 hover:text-white'}`}>
                        Ship
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in">

                            {/* IDENTITY GRID */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* PROFILE PHOTO */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neon-blue uppercase">Profile Photo</label>
                                    <div className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center">
                                        {content.profileImage ? (
                                            <img src={content.profileImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20"><User size={24} /></div>
                                        )}
                                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer flex-col">
                                            {uploading ? <Loader2 className="animate-spin text-white mb-1" /> : <Upload className="text-white mb-1" size={16} />}
                                            <span className="text-[9px] text-white font-bold uppercase">Change</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>

                                {/* BRAND LOGO */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neon-blue uppercase">Brand Logo</label>
                                    <div className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-2">
                                        {content.logoImage ? (
                                            <img src={content.logoImage} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">NO LOGO</div>
                                        )}
                                        <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer flex-col">
                                            {uploading ? <Loader2 className="animate-spin text-white mb-1" /> : <Upload className="text-white mb-1" size={16} />}
                                            <span className="text-[9px] text-white font-bold uppercase">Upload</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoImage')} disabled={uploading} />
                                        </label>
                                        {content.logoImage && (
                                            <button
                                                onClick={(e) => { e.preventDefault(); updateField('logoImage', ''); }}
                                                className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-lg hover:scale-110 transition z-20"
                                                title="Remove Logo"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Fallback URL Inputs */}
                            <input type="text" value={content.profileImage || ''} onChange={e => updateField('profileImage', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded p-2 text-[10px] text-white/30 focus:text-white outline-none mt-2" placeholder="Or paste Profile URL..." />

                            <p className="text-[10px] text-white/60 text-center uppercase tracking-widest border border-white/10 p-2 rounded bg-white/5">
                                Tip: The Brand Logo will appear on the First Ad Card.
                            </p>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neon-blue uppercase">Full Name</label>
                                <input type="text" value={content.fullName || ''} onChange={e => updateField('fullName', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm focus:border-neon-blue outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neon-blue uppercase">Job Title</label>
                                <input type="text" value={content.jobTitle || ''} onChange={e => updateField('jobTitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm focus:border-neon-blue outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neon-blue uppercase">Company Name</label>
                                <input type="text" value={content.company || ''} onChange={e => updateField('company', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm focus:border-neon-blue outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neon-blue uppercase">Contact Info (Footer)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" value={content.phone || ''} onChange={e => updateField('phone', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded p-3 text-sm outline-none" placeholder="Phone" />
                                    <input type="text" value={content.email || ''} onChange={e => updateField('email', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded p-3 text-sm outline-none" placeholder="Email" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                    <Phone size={16} /> Contact Details
                                </h3>
                                <input type="text" value={content.phone || ''} onChange={e => updateField('phone', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm outline-none" placeholder="Phone Number" />
                                <input type="text" value={content.email || ''} onChange={e => updateField('email', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm outline-none" placeholder="Email Address" />
                                <input type="text" value={content.website || ''} onChange={e => updateField('website', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm outline-none" placeholder="Website URL" />
                            </div>

                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                    <Globe size={16} /> Social Media
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" value={content.social_instagram || ''} onChange={e => updateField('social_instagram', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="Instagram URL" />

                                    <input type="text" value={content.social_facebook || ''} onChange={e => updateField('social_facebook', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="Facebook URL" />

                                    <input type="text" value={content.social_linkedin || ''} onChange={e => updateField('social_linkedin', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="LinkedIn URL" />

                                    <input type="text" value={content.social_tiktok || ''} onChange={e => updateField('social_tiktok', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="TikTok URL" />

                                    <input type="text" value={content.social_threads || ''} onChange={e => updateField('social_threads', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="Threads URL" />

                                    <input type="text" value={content.social_x || ''} onChange={e => updateField('social_x', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="X (Twitter) URL" />

                                    <input type="text" value={content.social_snapchat || ''} onChange={e => updateField('social_snapchat', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-xs outline-none" placeholder="Snapchat URL" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ads' && (
                        <div className="space-y-8 animate-in fade-in">
                            <p className="text-xs text-white/40">These 5 cards rotate automatically on the home screen. Leave title blank to hide a card.</p>

                            {/* Helper to update nested array */}
                            {['ad1', 'ad2', 'ad3', 'ad4', 'ad5'].map((ad, idx) => (
                                <div key={ad} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-neon-blue text-sm">CARD {idx + 1}</h4>
                                        <span className="text-[10px] uppercase bg-white/10 px-2 py-1 rounded">Rotator</span>
                                    </div>

                                    <input type="text" placeholder="Badge Text (e.g. URGENT)"
                                        value={content[ad]?.badge || ''}
                                        onChange={e => setContent({ ...content, [ad]: { ...content[ad], badge: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none" />

                                    <input type="text" placeholder="Title Line 1 (e.g. BOOK)"
                                        value={content[ad]?.title1 || ''}
                                        onChange={e => setContent({ ...content, [ad]: { ...content[ad], title1: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none font-bold" />

                                    <input type="text" placeholder="Title Line 2 (e.g. CALL)"
                                        value={content[ad]?.title2 || ''}
                                        onChange={e => setContent({ ...content, [ad]: { ...content[ad], title2: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none text-neon-blue" />

                                    <input type="text" placeholder="Button Link URL"
                                        value={content[ad]?.link || ''}
                                        onChange={e => setContent({ ...content, [ad]: { ...content[ad], link: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none" />

                                    <input type="text" placeholder="Button Label (e.g. CLAIM NOW)"
                                        value={content[ad]?.btnLabel || ''}
                                        onChange={e => setContent({ ...content, [ad]: { ...content[ad], btnLabel: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="space-y-8 animate-in fade-in">
                            <p className="text-xs text-white/40">These are the 4 main buttons in the Grid View.</p>

                            {['srv1', 'srv2', 'srv3', 'srv4'].map((srv, idx) => (
                                <div key={srv} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                                    <h4 className="font-bold text-neon-blue text-sm">BUTTON {idx + 1}</h4>

                                    <input type="text" placeholder="Title (e.g. Buy a Home)"
                                        value={content[srv]?.title || ''}
                                        onChange={e => setContent({ ...content, [srv]: { ...content[srv], title: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none font-bold" />

                                    <input type="text" placeholder="Subtitle (e.g. Start Search)"
                                        value={content[srv]?.subtitle || ''}
                                        onChange={e => setContent({ ...content, [srv]: { ...content[srv], subtitle: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none" />

                                    <input type="text" placeholder="Link URL (start with https://)"
                                        value={content[srv]?.link || ''}
                                        onChange={e => setContent({ ...content, [srv]: { ...content[srv], link: e.target.value } })}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs outline-none text-neon-blue" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'visuals' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                    <Image size={16} /> Marquee Text
                                </h3>
                                <input type="text" value={content.marqueeText || ''} onChange={e => updateField('marqueeText', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm outline-none" placeholder="e.g. 🚀 OPEN FOR BUSINESS..." />
                            </div>

                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                    <Image size={16} /> YouTube Video ID
                                </h3>
                                <input type="text" value={content.youtubeId || ''} onChange={e => {
                                    const val = e.target.value;
                                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                    const match = val.match(regExp);
                                    const id = (match && match[2].length === 11) ? match[2] : val;
                                    updateField('youtubeId', id);
                                }}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm outline-none" placeholder="Paste YouTube Link or ID" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-xl p-6 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <CreditCard size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Get Your Card</h3>
                                    <p className="text-xs text-white/60 mt-2">
                                        Get our premium black NFC card. Includes lifetime app access for limited time only!
                                    </p>
                                </div>
                                <a
                                    href="https://buy.stripe.com/6oU00i6UOa2YcVzaiH3gk00"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-[#635BFF] hover:bg-[#5851E3] text-white font-bold py-3 rounded-lg transition shadow-lg shadow-[#635BFF]/30"
                                >
                                    ORDER CARD NOW • $99
                                </a>
                                <p className="text-[10px] text-white/30">Processed securely by Stripe</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10 opacity-50 pointer-events-none grayscale">
                                <label className="text-xs font-bold text-neon-blue uppercase">Shipping Address</label>
                                <input type="text" placeholder="Address Line 1" className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm" />
                                    <input type="text" placeholder="Zip Code" className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm" />
                                </div>
                                <p className="text-[10px] text-yellow-500 italic">
                                    *Please enter shipping details directly in the Stripe Checkout page after clicking Order.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW */}
            <div className="flex-1 bg-[#111] relative flex items-center justify-center p-8">
                <div className="text-white/50 absolute top-4 right-4 text-xs font-mono">LIVE PREVIEW</div>

                <div className="relative w-[375px] h-[750px] border-[10px] border-[#222] rounded-[40px] overflow-hidden shadow-2xl bg-black transition-all hover:scale-[1.02]">
                    <iframe
                        id="preview-frame"
                        src={`/preview?id=${cardId}`}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                    />
                </div>
            </div>

        </div>
    );
}
