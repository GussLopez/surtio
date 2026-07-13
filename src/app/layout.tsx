import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"
import Providers from "./Providers";
import { Toaster } from "sileo";

const geist = Geist({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Surtio",
  description: "Gestiona inventario, ventas, productos y reportes desde una plataforma diseñada para negocios locales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geist.className} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute={'class'} defaultTheme="system">
          <Providers>
            {children}
          </Providers>
          <Toaster
            position="bottom-right"
            theme="dark"
            options={{
              fill: "#171717",
              roundness: 16,
              styles: {
                description: "text-neutral-100!",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
