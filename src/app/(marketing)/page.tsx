import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import Image from "next/image"

export default function Home() {
 return (
  <main className="flex flex-col min-h-screen bg-background animate-fade-in">
   <header className="flex items-center justify-end gap-2 fixed top-0 left-0 right-0 w-full p-2 lg:px-4">
    <ThemeToggle />
   </header>
   <section className="flex flex-col items-center justify-center gap-12 max-w-xl w-full mx-auto min-h-screen px-2 lg:px-4">
    <Image
     src="/logo.png"
     alt="Noteworthy logo"
     width={200}
     height={200}
    />
    <h1 className="text-slate-800 dark:text-slate-100 text-center text-2xl lg:text-4xl">Simple note taking with Noteworthy</h1>
    <div className="flex items-center justify-center gap-4">
     <Button
      type="button"
      size="lg"
      className="w-full"
      asChild
     >
      <SignUpButton />
     </Button>
     <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      asChild
     >
      <SignInButton />
     </Button>
    </div>
   </section>
  </main>
 )
}