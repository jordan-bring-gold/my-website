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
// Prefer declaring icons in the Next metadata API so the app router injects them properly
// See: https://nextjs.org/docs/app/api-reference/functions/metadata
export const icons = {
  icon: "/favicon.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
        <link rel="icon" href="/favicon-dark.svg"  type="image/svg+xml" media="(prefers-color-scheme: light)">
        <link rel="icon" href="/favicon-light.svg"  type="image/svg+xml" media="(prefers-color-scheme: dark)">

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
