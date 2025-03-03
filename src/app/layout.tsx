import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import { GeistSans } from 'geist/font/sans';
import { CartProvider } from "./context/cart";
import { AlertDialogProvider } from "./context/dialog";
import { AuthProvider } from "./context/auth";
import { CouponProvider } from "./context/coupon";
import { ToastSideProvider } from "./context/toastSide";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="pt">
          <head>
              <meta charSet="utf-8" />
              <link rel="stylesheet" href="assets/css/banner.css" />
              <link rel="shortcut icon" href="favicon.png" />
              <meta name="robots" content="index, follow" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#fff" />
              <meta name="msapplication-navbutton-color" content="#fff" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="#fff" />
              <script src="https://sdk.mercadopago.com/js/v2"></script>
          </head>
          <body id="myBody">
              <ToastSideProvider>
                  <AuthProvider>
                      <CouponProvider>
                          <AlertDialogProvider>
                              <CartProvider>
                                  {children}
                              </CartProvider>
                          </AlertDialogProvider>
                    </CouponProvider>
                  </AuthProvider>
              </ToastSideProvider>
          </body>
      </html>
  );
}
