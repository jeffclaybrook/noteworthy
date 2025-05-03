"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { useDebouncedCallback } from "use-debounce"
import { UserButton } from "@clerk/nextjs"
import { Grid, List, Search } from "./Icons"
import clsx from "clsx"

type ViewMode = "grid" | "list"

type SearchBarProps = {
 view: ViewMode
 onToggleView: () => void
 onSearch: (query: string) => void
}

export function SearchBar({ view, onToggleView, onSearch }: SearchBarProps) {
 const [query, setQuery] = useState<string>("")
 const [visible, setVisible] = useState<boolean>(true)
 const [lastScrollY, setLastScrollY] = useState<number>(0)

 const debouncedSearch = useDebouncedCallback((value: string) => {
  onSearch(value.trim().toLowerCase())
 }, 300)

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setQuery(value)
  debouncedSearch(value)
 }

 useEffect(() => {
  const handleScroll = () => {
   const currentY = window.scrollY

   if (currentY > lastScrollY && currentY > 0) {
    setVisible(false)
   } else {
    setVisible(true)
   }

   setLastScrollY(currentY)
  }

  window.addEventListener("scroll", handleScroll)

  return () => window.removeEventListener("scroll", handleScroll)
 }, [lastScrollY])

 return (
  <header
   className={clsx(
    "fixed top-0 left-0 right-0 w-full transition-all duration-500 z-40 p-2",
    visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
   )}
  >
   <div className="flex relative rounded-full bg-[#e9eef6]">
    <Search className="absolute inset-y-[13px] left-4 pointer-events-none text-gray-500" />
    <input
     type="text"
     placeholder="Search notes..."
     value={query}
     onChange={handleChange}
     className="w-full px-12 py-3 text-slate-800 border-none outline-none"
    />
    <div className="flex items-center justify-end gap-4 absolute inset-y-[13px] right-4">
     <button
      onClick={onToggleView}
      aria-label="Toggle view"
      className="text-slate-800 rounded-full cursor-pointer transition hover:text-slate-900"
     >
      {view === "grid" ? <List /> : <Grid />}
     </button>
     <UserButton />
    </div>
   </div>
  </header>
 )
}