import { Empty } from "./Icons"

export function EmptyState() {
 return (
  <div className="flex flex-col items-center justify-center h-screen">
   <Empty />
   <p className="text-slate-800 text-center mt-8">You haven&apos;t created any notes yet!</p>
  </div>
 )
}