import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "LifePilot AI OS",
  description: "AI Life Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <I18nProvider>
      {children}
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  );
}