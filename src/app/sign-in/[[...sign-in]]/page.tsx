import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
 return (
  <main className="flex items-center justify-center fixed top-0 left-0 h-screen w-full overflow-hidden animate-fade-in">
   <SignIn />
  </main>
 )
}