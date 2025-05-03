export function Spinner() {
 return (
  <div className="flex flex-col items-center justify-center h-screen">
   <div className="p-4 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
   <p className="text-slate-800 text-center animate-pulse mt-8">Loading notes...</p>
  </div>
 )
}