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

// Helper to shuffle and pick N items
function getRandomTopics(count: number, excludeTitle?: string) {
    const shuffled = [...TG_BRAIN_DATA].sort(() => 0.5 - Math.random());
    // Filter out if needed
    const filtered = excludeTitle
        ? shuffled.filter(item => item[1] !== excludeTitle)
        : shuffled;
    return filtered.slice(0, count);
}

type Message = {
    text: string | JSX.Element;
    type: 'bot' | 'user' | 'system';
};

export default function NetworkingOS() {
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'bot',
            text: <span>Welcome to the <strong>TapOS Neural Interface</strong>. 🧠<br />Select a topic below, or ask me anything about networking strategies.</span>
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Suggestion bubbles at the bottom
    const [suggestions, setSuggestions] = useState(() => getRandomTopics(4));

    const [clickCount, setClickCount] = useState(0);

    const chatBodyRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, suggestions]);

    const handleTopicClick = (index: number, topicItem?: typeof TG_BRAIN_DATA[number]) => {
        if (isTyping) return;

        // If clicked from grid (legacy) or valid topic passed
        let topic;
        if (topicItem) {
            topic = topicItem;
        } else {
            topic = TG_BRAIN_DATA[index];
        }

        const userQ = topic[2];
        const answers = topic[3];
        const botResponse = answers[Math.floor(Math.random() * answers.length)];

        // Increment global interactions
        setClickCount(prev => prev + 1);

        // Add User Message
        setMessages(prev => [...prev, { text: userQ, type: 'user' }]);
        setIsTyping(true);

        // Simulate Typing and Add Bot Message
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: botResponse, type: 'bot' }]);

            // Interaction Logic: Offer TapOS every 3 clicks
            if ((clickCount + 1) % 3 === 0) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'system',
                        text: (
                            <div className="flex flex-col gap-2 items-start mt-2">
                                <span className="text-neon-blue font-bold text-sm uppercase">PRO TIP DETECTED</span>
                                <span className="text-white/80 text-sm">Want to implement this strategy instantly? The TapOS card does the heavy lifting for you.</span>
                                <a href="/login?view=sign_up" className="inline-block bg-white/10 hover:bg-neon-blue hover:text-black border border-white/20 px-4 py-2 rounded-lg text-xs font-bold transition mt-1">
                                    GET IMPULSÓ
                                </a>
                            </div>
                        )
                    }]);
                }, 400); // Small delay after bot answer
            }

            // Refresh suggestions
            setSuggestions(getRandomTopics(4, topic[1]));

        }, 800);
    };

    return (
        <div id="tg-os-360-root">
            <div className="tg-os-section">

                <div className="tg-os-header">
                    <h2>Neural <span>Assistant</span></h2>
                    <p>Ask anything about networking, sales, or growth.</p>
                </div>

                <div className="tg-os-container" style={{ maxWidth: '500px' }}>

                    {/* CENTERED CHAT INTERFACE (Mobile Friendly) */}
                    <div className="tg-os-phone-wrap" style={{ width: '100%', height: '700px', border: 'none', filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))' }}>
                        <div className="tg-os-chat-ui" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>

                            <div className="tg-os-chat-header">
                                <div className="tg-os-avatar"><i className="fas fa-robot"></i></div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'white' }}>TapOS AI</div>
                                    <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>● ONLINE</div>
                                </div>
                            </div>

                            <div className="tg-os-chat-body" ref={chatBodyRef} id="tg-os-chat-stream">
                                <div className="flex-1"></div> {/* Push messages down */}
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

                            {/* SUGGESTIONS AREA (Replaces Grid) */}
                            <div className="p-4 border-t border-white/5 bg-black/20">
                                <div className="text-[10px] uppercase text-white/30 font-bold mb-3 tracking-widest">Suggested Prompts</div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleTopicClick(0, item)}
                                            disabled={isTyping}
                                            className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-blue/50 rounded-xl px-4 py-3 bg-opacity-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <i className={`fas ${item[0]} text-neon-blue text-opacity-70 group-hover:text-opacity-100`}></i>
                                                <span className="text-sm font-medium text-white/80 group-hover:text-white">{item[1]}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
