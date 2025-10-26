'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import { GeistSans } from 'geist/font/sans';
import { CartProvider } from "./context/CartProvider";
import { AlertDialogProvider } from "./context/AlertDialogProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ToastSideProvider } from "./context/ToastSideProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CookiesProvider } from 'react-cookie';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="pt" suppressHydrationWarning>
          <head>
              <meta charSet="utf-8" />
              <link rel="shortcut icon" href="favicon.png" />
              <meta name="robots" content="index, follow" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#fff" />
              <meta name="msapplication-navbutton-color" content="#fff" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="#fff" />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    // Este script evita erros de hidratação por diferenças de tempo
                    window.__NEXT_HYDRATION_MARK = Date.now();
                  `,
                }}
              />
          </head>
          <body id="myBody">
              <ToastSideProvider>
                  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                      <CookiesProvider>
                          <AuthProvider>
                                  <AlertDialogProvider>
                                      <CartProvider>
                                          {children}
                                      </CartProvider>
                                  </AlertDialogProvider>
                          </AuthProvider>
                      </CookiesProvider>
                  </GoogleOAuthProvider>
              </ToastSideProvider>
          </body>
      </html>
  );
}
