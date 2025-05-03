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
  description: "A simple note taking app built with Next.js"
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${mulish.variable} antialiased`}>
          {children}
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  )
}