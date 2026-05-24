import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ママログ",
  description: "ワンオペ育児中のママが、家族の予定・タスク・気持ちをやさしく管理できるアプリ",
};

/** ノッチ機種で Safe Area が効くようにする */
export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="mamalog-app-root">{children}</body>
    </html>
  );
}
