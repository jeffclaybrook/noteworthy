import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Noteworthy",
  description: "A note-taking app created with Next.js, Prisma, and shadcn-ui"
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: "simple"
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-center" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}