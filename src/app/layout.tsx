import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobPilot",
  description:
    "JobPilot hjælper dig med at vurdere job, generere ansøgninger og følge hele din jobsøgning ét sted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="da"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.14),_transparent_33%),linear-gradient(180deg,_#f7fbfd_0%,_#eef5f8_50%,_#ffffff_100%)] text-slate-950">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-10 pt-6 sm:px-8 lg:px-12">
          <TopNav />
          <main className="flex flex-1 flex-col">{children}</main>
          <footer className="mt-16 border-t border-slate-200/80 pt-8 text-sm text-slate-500">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>JobPilot</p>
              <p>AI-platform til jobvurdering, ansøgninger og overblik i jobsøgningen.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
