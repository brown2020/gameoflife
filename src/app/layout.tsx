import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game of Life",
  description: "Demo of Conway's Game of Life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
