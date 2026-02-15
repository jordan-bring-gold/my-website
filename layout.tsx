import type { Metadata } from "next";
import "./globals.css";
import { cn } from "./lib/utils";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "Jordan Bringgold",
  description: "A personal brand website showcasing my experience and work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const briefcaseSvg = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"13\" rx=\"2\" fill=\"%23000\"/><rect x=\"7\" y=\"3\" width=\"10\" height=\"4\" rx=\"1\" fill=\"%23000\"/></svg>`;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Code+Pro:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,${encodeURIComponent(briefcaseSvg)}`}
          type="image/svg+xml"
        />
      </head>
      <body className={cn("min-h-screen font-body antialiased flex flex-col")}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
