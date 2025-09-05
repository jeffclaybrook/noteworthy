import { LoadingIcon } from "./Icons"

export function Loader() {
 return (
  <main className="flex flex-col items-center justify-center fixed top-0 left-0 h-screen w-full overflow-hidden">
   <LoadingIcon className="size-12 text-slate-600 dark:text-slate-300 animate-spin" />
   <p className="text-slate-800 dark:text-slate-100 text-center mt-4 animate-pulse">Loading notes...</p>
  </main>
 )
}