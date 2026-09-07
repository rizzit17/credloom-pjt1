import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import SiteAurora from '@/components/ui/SiteAurora';
import "./globals.css";

const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Credloom | Autonomous Under-Collateralized Lending Terminal",
  description: "Precision micro-lending protocol backed by AI default risk scoring and smart contract escrow settlement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${interSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0E1013] text-[#F5F3EE] selection:bg-[#C9A24B] selection:text-[#0E1013]`}
      >
        <AuthProvider>
          <Navbar />
          <SiteAurora />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
