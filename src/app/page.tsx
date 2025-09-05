import { Atma } from "next/font/google"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/Icons"
import { ThemeToggle } from "@/components/ThemeToggle"
import Image from "next/image"
import Link from "next/link"

const atma = Atma({
 weight: ["300", "400", "500", "600", "700"]
})

export default function Home() {
 return (
  <>
   <header className="flex items-center justify-between gap-2 fixed top-0 left-0 right-0 w-full p-2 lg:px-4 z-50">
    <Link
     href={"/"}
     aria-label="Home page"
     className="flex items-center gap-1 text-slate-800 dark:text-slate-100"
    >
     <LogoIcon className="size-8" />
     <span className={`${atma.className} text-xl`}>Noteworthy</span>
    </Link>
    <div className="flex items-center justify-end gap-3">
     <ThemeToggle />
     <Button
      type="button"
      variant="outline"
      aria-label="Sign in"
      asChild
     >
      <SignInButton />
     </Button>
    </div>
   </header>
   <main className="flex flex-col items-center justify-center gap-12 h-screen px-2 lg:px-4">
    <Image
     src="/logo.png"
     alt="Noteworthy logo"
     width={200}
     height={200}
    />
    <h1 className="text-slate-800 dark:text-slate-100 text-center text-2xl lg:text-4xl font-light">
     Simple note taking with <strong className={`${atma.className} font-semibold text-[#4c5d87]`}>Noteworthy</strong>
    </h1>
    <Button
     type="button"
     size="lg"
     aria-label="Sign up"
     asChild
    >
     <SignUpButton />
    </Button>
   </main>
  </>
 )
}