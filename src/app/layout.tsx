import type { Metadata } from "next"
import { Mulish } from "next/font/google"
import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import "./globals.css"

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Noteworthy",
  description: "A simple note taking app build with Next.js",
  manifest: "/manifest.json",
  themeColor: "#ffffff"
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#ffffff" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={`${mulish.variable} antialiased`}>
          {children}
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  )
}