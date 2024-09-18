import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import { GeistSans } from 'geist/font/sans';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="pt">
        <Head>
          <meta charSet="utf-8" />
          <link rel="stylesheet" type="text/css" href="assets/css/banner.css" />
          <link rel="shortcut icon" type="image/png" href="favicon.png" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#fff" />
          <meta name="msapplication-navbutton-color" content="#fff" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#fff" />
        </Head>
        <body className={GeistSans.className} suppressHydrationWarning={true}>{children}</body>
    </html>

  );
}
