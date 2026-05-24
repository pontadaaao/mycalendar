import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mamalog: {
          main: "#FF7F91",
          sub: "#FFE8E8",
          /** アプリ共通の下地（一覧のフェードなど）— 単色グラデとは近いトーンで統一 */
          bg: "#FFFAFB",
          page: "#FFFAFB",
          text: "#3A2A2A",
          muted: "#9A8A8A",
          blue: "#8EB8FF",
          green: "#9BD6A3",
          purple: "#B7A3E8",
          orange: "#F5B36B",
          yellow: "#F6D365",
        },
      },
      fontFamily: {
        sans: [
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 16px rgba(255, 127, 145, 0.08)",
        float: "0 8px 32px rgba(58, 42, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
