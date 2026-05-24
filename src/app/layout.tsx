import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ママログ",
  description: "ワンオペ育児中のママが、家族の予定・タスク・気持ちをやさしく管理できるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
