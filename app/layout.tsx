import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { I18nProvider } from "@/lib/i18n";
import { AlertChecker } from "@/components/alert-checker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Research",
  description:
    "Data analysis, findings, and original research across equities, crypto, macro, and prediction markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col lg:flex-row">
        <ThemeProvider>
          <I18nProvider>
            <Sidebar />
            <AlertChecker />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
