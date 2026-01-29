'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center font-mono">
            <h2 className="text-xl font-bold text-red-500 mb-4 font-syncopate">SYSTEM CRASH DETECTED</h2>
            <p className="text-white/50 text-xs mb-4">The digital identity engine encountered a critical error.</p>

            <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-left text-xs text-red-300 font-mono mb-6 max-w-md w-full overflow-auto max-h-[300px]">
                <p className="mb-2 uppercase font-bold text-white/70">Error Details:</p>
                <p>{error.message}</p>
                {error.digest && <p className="mt-2 text-white/30">Digest: {error.digest}</p>}
            </div>

            <button
                onClick={() => reset()}
                className="px-8 py-3 bg-neon-blue text-black rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-white transition shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            >
                Reboot System
            </button>
        </div>
    );
}
