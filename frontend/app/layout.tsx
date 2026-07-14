import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "./providers";
import { ScrollProgress } from "@/components/landing-page/scroll-progress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexHR-AI | AI-Powered Workforce Intelligence Platform",
  description:
    "Transform your workforce data into actionable intelligence. Predict flight risks, optimize compensation, and power your people strategy with enterprise-grade AI.",
  keywords: [
    "HR Analytics",
    "AI",
    "Workforce Intelligence",
    "Attrition Prediction",
    "People Analytics",
  ],
  openGraph: {
    title: "NexHR-AI | Workforce Intelligence Platform",
    description:
      "Enterprise AI-Powered Workforce Analytics & Employee Retention Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ScrollProgress />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
