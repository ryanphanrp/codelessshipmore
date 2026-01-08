import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "@fontsource/jetbrains-mono";
import "@fontsource/fira-code";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { AISettingsProvider } from "@/contexts/ai-settings-context";
import { AppSidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CodelessShipMore - Developer Tools",
  description: "A collection of developer utilities for JSON, SQL, Protobuf, and Properties conversion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistMono.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <AISettingsProvider>
              <AppSidebar>
                {children}
              </AppSidebar>
            </AISettingsProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
