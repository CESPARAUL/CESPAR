import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { AccountSidebar, AccountPageShell, HideOnAccountPage } from "@/components/layout/AccountSidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["italic", "normal"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CESPAR | Centre for Space Research, Anchor University Lagos",
  description:
    "Centre for Space Research (CESPAR), Anchor University Lagos advances atmospheric, solar-terrestrial and radio science research through ground-based facilities and open research data access.",
  keywords: [
    "CESPAR",
    "Centre for Space Research",
    "Anchor University Lagos",
    "space weather",
    "atmospheric research",
    "VLF radio",
    "space science Nigeria",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-space-950 text-foreground">
        <AuthProvider>
          <Header />
          <main className="flex-1">
            <AccountPageShell>{children}</AccountPageShell>
          </main>
          <HideOnAccountPage>
            <Footer />
          </HideOnAccountPage>
          <FloatingWhatsApp />
          <AccountSidebar />
        </AuthProvider>
      </body>
    </html>
  );
}
