import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Big_Shoulders_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CallNowBar } from "@/components/CallNowBar";
import { ChatWidget } from "@/components/ChatWidget/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
});

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-industrial",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lyonselectricalcontractorsinc.com"),
  title: {
    default: "Lyons Electrical — 24/7 Master Electricians, South NJ & Tri-State",
    template: "%s · Lyons Electrical",
  },
  description:
    "A master electrician answers the phone 24 hours a day, 7 days a week, 365 days a year. Family-owned for 29+ years. 5.0 stars / 436 Google reviews. Serving South Jersey, parts of PA & DE.",
  openGraph: {
    siteName: "Lyons Electrical",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${bigShoulders.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1 pb-28 lg:pb-0">{children}</main>
        <SiteFooter />
        <CallNowBar />
        <ChatWidget />
      </body>
    </html>
  );
}
