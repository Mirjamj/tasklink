import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "TaskLink - Where work comes together",
    template: "%s | TaskLink - Where work comes together"
  },
  description: "TaskLink is a smart task management platform that brings your team, tasks, and workflow together - so you can focus on what matters most.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="wrapper">
            <div className="border my-4 rounded-2xl p-4 sm:p-8 min-h-[calc(100svh-2rem)]">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
