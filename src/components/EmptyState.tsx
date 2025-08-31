import { EmptyIcon } from "./Icons"

export function EmptyState() {
 return (
  <section className="flex flex-col items-center justify-center h-screen overflow-hidden">
   <EmptyIcon />
   <p className="text-slate-800 dark:text-slate-100 text-center mt-4">You haven&apos;t created any notes yet</p>
  </section>
 )
}