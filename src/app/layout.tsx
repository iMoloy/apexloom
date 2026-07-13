import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ApexLoom | Remarkable places, considered well",
    template: "%s | ApexLoom",
  },
  description:
    "A considered collection of exceptional stays and spaces, curated for the way you want to travel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <LayoutWrapper>
          <Navbar />
          {children}
          <Footer />
        </LayoutWrapper>
      </body>
    </html>
  );
}

