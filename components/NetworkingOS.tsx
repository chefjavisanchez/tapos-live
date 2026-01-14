'use client';

import { useState, useRef, useEffect } from 'react';

// Brain Data: [Icon, Title, Question, AnswersArray, CategoryClass]
const TG_BRAIN_DATA = [
    // NETWORKING (Blue)
    ["fa-handshake", "First Impressions", "How do I win the first 7 seconds?",
        ["The tap creates a 'pattern interrupt.' It shows you are modern and prepared.", "Strategy: Smile, make eye contact, then TAP. Do not look at your phone.", "Mindset: Confidence is silent. Your tool speaks for you."], "tg-cat-net"],
    ["fa-user-plus", "The Follow-Up", "Why do I fail at follow-ups?",
        ["Because you wait too long. Tap & Go automates it instantly.", "Strategy: Send a 'Nice to meet you' text while standing there.", "Growth: The fortune is in the follow-up."], "tg-cat-net"],
    ["fa-users", "Social Capital", "How do I build influence?",
        ["Stop collecting cards. Start building a database.", "Strategy: Tag contacts instantly (e.g., 'Investor', 'Client').", "Mind: Your network is your net worth."], "tg-cat-net"],
    ["fa-comment-dots", "Small Talk", "I hate awkward small talk.",
        ["The card is the ultimate icebreaker.", "Strategy: Use 'Portfolio' to shift focus to your work.", "Skill: Great networkers listen."], "tg-cat-net"],
    ["fa-share-alt", "Referrals", "How do I get referrals?",
        ["Make yourself shareable via text in 1 second.", "Strategy: Ask: 'Can you forward my profile right now?'", "Business: Friction kills referrals."], "tg-cat-net"],
    ["fa-calendar-check", "Booking", "Turn chats into meetings.",
        ["Say 'Tap here and pick a slot on my calendar.'", "Strategy: Close the loop immediately.", "Productivity: Eliminate email ping-pong."], "tg-cat-net"],
    ["fa-id-badge", "Personal Brand", "Does this fit my brand?",
        ["It elevates it. It is your mini-website.", "Strategy: Update your 'Featured' link weekly.", "Identity: You are the CEO of You."], "tg-cat-net"],
    ["fa-qrcode", "Accessibility", "What if they aren't techy?",
        ["The QR code covers everyone.", "Strategy: Keep QR on lockscreen for loud events.", "Service: Meet people where they are."], "tg-cat-net"],
    ["fa-bullhorn", "Storytelling", "How do I pitch myself?",
        ["Use the Video Intro feature.", "Strategy: Record a 30s 'Who I Am' video.", "Art: Facts tell, stories sell."], "tg-cat-net"],
    ["fa-address-book", "CRM Sync", "I hate data entry.",
        ["We automate it to your CRM.", "Strategy: Use Zapier to trigger a welcome email.", "System: Systems scale."], "tg-cat-net"],

    // BUSINESS (Green)
    ["fa-chart-line", "Sales Velocity", "I need to close faster.",
        ["Tap & Go removes friction.", "Strategy: Direct them to a 'Buy Now' link.", "Metric: Speed to lead = Conversion."], "tg-cat-gro"],
    ["fa-store", "Digital Store", "Can I sell on the spot?",
        ["Yes. Showcase products and take payments.", "Strategy: Wear your product, tap and sell.", "Asset: Every chat is a transaction."], "tg-cat-gro"],
    ["fa-file-invoice-dollar", "ROI", "Is this worth it?",
        ["One client pays for a lifetime.", "Strategy: Track who converted.", "Business: Low overhead, high leverage."], "tg-cat-gro"],
    ["fa-filter", "Funnel Entry", "Feed the machine.",
        ["The card is Top of Funnel.", "Strategy: Create a 'Networking Exclusive' offer.", "Growth: A handshake is a lead."], "tg-cat-gro"],
    ["fa-cogs", "Automation", "I want to work less.",
        ["Automation is freedom.", "Strategy: Set it up once, works 24/7.", "Life: Save 5 hours a week."], "tg-cat-gro"],
    ["fa-lock", "Privacy", "Protect your energy.",
        ["You control what data is public.", "Strategy: Use 'Direct Mode' for LinkedIn.", "Boundaries: Prevent burnout."], "tg-cat-gro"],
    ["fa-globe", "Eco-Friendly", "Sustainability matters.",
        ["1 digital card replaces 10k paper ones.", "Strategy: Mention you went paperless.", "Values: Conscious business wins."], "tg-cat-gro"],
    ["fa-video", "Content King", "Show, don't just tell.",
        ["Embed your best YouTube video.", "Strategy: Rotate video monthly.", "Authority: Video builds trust."], "tg-cat-gro"],
    ["fa-users-cog", "Team Mgmt", "Scale your team.",
        ["Manage team cards from one dashboard.", "Strategy: Ensure brand consistency.", "Leadership: Give the best tools."], "tg-cat-gro"],
    ["fa-bolt", "Speed", "Friction kills deals.",
        ["No typing. Just tap.", "Strategy: Be the fastest person in the room.", "Physics: Momentum is everything."], "tg-cat-gro"],

    // MINDSET (Purple)
    ["fa-brain", "Mental Load", "My brain is fried.",
        ["Externalize memory. We remember for you.", "Strategy: Use 'Notes' immediately.", "Health: Clear mind, better decisions."], "tg-cat-mind"],
    ["fa-battery-full", "Energy", "I get drained.",
        ["Data entry drains you. Tapping saves energy.", "Strategy: Save energy for connection.", "Body: High energy wins."], "tg-cat-mind"],
    ["fa-smile", "Confidence", "I feel like an imposter.",
        ["Pro tools give pro posture.", "Strategy: Know your tech works.", "Psychology: Competence breeds confidence."], "tg-cat-mind"],
    ["fa-hourglass", "Time Mgmt", "I have no time.",
        ["Automation buys time.", "Strategy: Reclaim 30 mins per event.", "Life: Use saved time for gym."], "tg-cat-mind"],
    ["fa-eye", "Focus", "I get distracted.",
        ["System forces a process.", "Strategy: Be present.", "Zen: Single-tasking is power."], "tg-cat-mind"],
    ["fa-heart", "Empathy", "Is tech cold?",
        ["Tech enables humanity.", "Strategy: Ask: 'How can I help you?'", "Soul: Connection is why we are here."], "tg-cat-mind"],
    ["fa-walking", "Posture", "Body language.",
        ["Fumbling looks clumsy. Tapping looks slick.", "Strategy: Smooth movements signal authority.", "Body: Move with purpose."], "tg-cat-mind"],
    ["fa-list-alt", "Clarity", "I feel disorganized.",
        ["Order creates calm.", "Strategy: Review contacts weekly.", "Mind: Clean data, clear mind."], "tg-cat-mind"],
    ["fa-graduation-cap", "Growth", "Always be learning.",
        ["Update your card as you grow.", "Strategy: It is a living document.", "Future: Show your progress."], "tg-cat-mind"],
    ["fa-infinity", "Legacy", "What are you building?",
        ["A network that supports your life.", "Strategy: Treat taps as seeds.", "Vision: Play the long game."], "tg-cat-mind"]
] as const;

type Message = {
    text: string | JSX.Element;
    type: 'bot' | 'user';
};

export default function NetworkingOS() {
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'bot',
            text: <span>Welcome to the 360 Command Center. 🌐<br /><br />Select a module on the right to initialize growth protocols.<br /><br />Awaiting input. 👇</span>
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [clickTrackers, setClickTrackers] = useState<number[]>(new Array(TG_BRAIN_DATA.length).fill(0));
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleTopicClick = (index: number) => {
        if (isTyping) return;

        const topic = TG_BRAIN_DATA[index];
        const userQ = topic[2];
        const answerIndex = clickTrackers[index] % 3;
        const botResponse = topic[3][answerIndex];

        // Update trackers
        const newTrackers = [...clickTrackers];
        newTrackers[index]++;
        setClickTrackers(newTrackers);

        // Add User Message
        setMessages(prev => [...prev, { text: userQ, type: 'user' }]);
        setIsTyping(true);

        // Simulate Typing and Add Bot Message
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: botResponse, type: 'bot' }]);
        }, 600);
    };

    return (
        <div id="tg-os-360-root">
            <div className="tg-os-section">

                <div className="tg-os-header">
                    <h2>Tap & Go <span>OS 360</span></h2>
                    <p>Your Neural Command Center for Networking, Growth, and High-Performance.</p>
                    <div className="tg-os-badge">
                        <i className="fas fa-mouse-pointer"></i> Click Once for Intel • Click Twice for Strategy
                    </div>
                </div>

                <div className="tg-os-container">

                    {/* LEFT: PHONE CHAT */}
                    <div className="tg-os-phone-wrap">
                        <div className="tg-os-chat-ui">
                            <div className="tg-os-chat-header">
                                <div className="tg-os-avatar"><i className="fas fa-microchip"></i></div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>OS 360 CORE</div>
                                    <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>● SYSTEM ONLINE</div>
                                </div>
                            </div>

                            <div className="tg-os-chat-body" ref={chatBodyRef} id="tg-os-chat-stream">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`tg-os-msg ${msg.type}`}>
                                        {msg.text}
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="tg-os-typing" style={{ display: 'flex' }}>
                                        <div className="tg-dot"></div><div className="tg-dot"></div><div className="tg-dot"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: COMMAND CENTER */}
                    <div className="tg-os-command-center">
                        <div className="tg-os-cc-header">
                            <div className="tg-os-cc-title">
                                <span>Neural Interface</span>
                                <h3>Command Grid</h3>
                            </div>
                            <i className="fas fa-network-wired" style={{ color: '#6366f1', fontSize: '20px' }}></i>
                        </div>

                        <div className="tg-os-grid-area">
                            <div className="tg-os-btn-grid" id="tg-os-buttons-container">
                                {TG_BRAIN_DATA.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tg-os-btn ${item[4]}`}
                                        onClick={() => handleTopicClick(index)}
                                    >
                                        <i className={`fas ${item[0]}`}></i>
                                        <span>{item[1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
