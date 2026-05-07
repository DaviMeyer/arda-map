import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyborg Season Tracker — Arda Saatçi",
  description: "600 km Ultrarun: Death Valley → Santa Monica Pier",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
