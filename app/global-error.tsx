'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-black text-white h-screen flex flex-col items-center justify-center p-6 text-center font-mono">
                <h2 className="text-2xl font-bold text-red-500 mb-4 tracking-widest uppercase">Critical System Failure</h2>
                <p className="text-white/50 text-sm mb-8">The core interface encountered an unrecoverable error.</p>

                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-left text-xs text-red-300 font-mono mb-8 max-w-md w-full overflow-auto">
                    <p className="mb-2 uppercase font-bold text-white/70">Diagnostics:</p>
                    <p>{error.message}</p>
                </div>

                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-neon-blue text-black rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-white transition"
                >
                    Reinitialize
                </button>
            </body>
        </html>
    );
}
