import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    blue: "#00f3ff",
                    purple: "#bc13fe",
                },
                space: {
                    900: "#000000",
                    800: "#050510",
                    700: "#0a0a1f",
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "cyber-grid": "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
            },
        },
    },
    plugins: [],
};
export default config;
