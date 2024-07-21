import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import RootProviders from "@/components/providers/RootProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoinKeeper",
  description: "best way to keep track of your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark" style={{colorScheme: "dark"}}>
      <body className={inter.className}>
      <RootProviders>
        {children}   
      </RootProviders>

      </body>
    </html>
    </ClerkProvider>
  );
}
