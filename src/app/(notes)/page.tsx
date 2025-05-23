"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, UserButton } from "@clerk/nextjs"
import { toast } from "sonner"
import { Note } from "@prisma/client"
import { Add } from "@/components/Icons"
import { BottomSheet } from "@/components/BottomSheet"
import { EmptyState } from "@/components/EmptyState"
import { NoteForm } from "@/components/NoteForm"
import { NotesList } from "@/components/NotesList"
import { SearchBar } from "@/components/SearchBar"
import { Spinner } from "@/components/Spinner"

type ViewMode = "grid" | "list"

export default function Notes() {
 const { isLoaded, isSignedIn } = useAuth()
 const [notes, setNotes] = useState<Note[]>([])
 const [isLoading, setIsLoading] = useState<boolean>(true)
 const [query, setQuery] = useState<string>("")
 const [view, setView] = useState<ViewMode>("grid")
 const [sheetOpen, setSheetOpen] = useState<boolean>(false)
 const [selectedNote, setSelectedNote] = useState<Note | null>(null)

 const router = useRouter()

 useEffect(() => {
  const fetchNotes = async () => {
   const res = await fetch("/api/notes")
   const data = await res.json()
   setNotes(data)
   setIsLoading(false)
  }

  fetchNotes()
 }, [])

 useEffect(() => {
  if (isLoaded && !isSignedIn) {
   router.push("/sign-in")
  }
 }, [isLoaded, isSignedIn])

 useEffect(() => {
  const stored = localStorage.getItem("viewMode") as ViewMode
  if (stored === "grid" || stored === "list") setView(stored)
 }, [])

 useEffect(() => {
  localStorage.setItem("viewMode", view)
 }, [view])

 const toggleView = () => {
  setView((prev) => (prev === "grid" ? "list" : "grid"))
 }

 const sortedNotes = [...notes].sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
 )

 const filteredNotes = sortedNotes.filter(note =>
  note.title?.toLowerCase().includes(query.toLowerCase()) ||
  note.content?.toLowerCase().includes(query.toLowerCase())
 )

 const handleSave = async (savedNote: Note) => {
  setNotes((prev) => {
   const exists = prev.find((note) => note.id === savedNote.id)

   if (exists) {
    return prev.map((note) => (note.id === savedNote.id ? savedNote : note))
   }

   return [savedNote, ...prev]
  })

  setSelectedNote(null)
  setSheetOpen(false)
 }

 const handleDelete = async () => {
  if (!selectedNote) return

  try {
   await fetch(`/api/notes/${selectedNote.id}`, {
    method: "DELETE"
   })

   setNotes(notes.filter(note => note.id !== selectedNote.id))
   setSheetOpen(false)
   setSelectedNote(null)
   toast.success("Note deleted successfully!")
  } catch (error) {
   console.error("Error deleting note:", error)
   toast.error("Uh-oh! There was a problem deleting your note")
  }
 }

 const openCreateSheet = () => {
  setSelectedNote(null)
  setSheetOpen(true)
 }

 const openEditSheet = (note: Note) => {
  setSelectedNote(note)
  setSheetOpen(true)
 }

 return (
  <>
   {isLoading ? (
    <Spinner />
   ) : (
    <>
     {notes.length === 0 ? (
      <>
       <nav className="flex items-center justify-end fixed top-0 left-0 right-0 w-full p-4">
        <UserButton />
       </nav>
       <EmptyState />
      </>
     ) : (
      <>
       <SearchBar onSearch={setQuery} view={view} onToggleView={toggleView} />
       {filteredNotes.length === 0 ? (
        <p className="text-slate-800 text-center mt-10">No matching notes found.</p>
       ) : (
        <NotesList
         notes={filteredNotes}
         view={view}
         onClick={openEditSheet}
        />
       )}
      </>
     )}
     <button
      onClick={openCreateSheet}
      aria-label="Create note"
      className="inline-flex items-center gap-2 fixed bottom-6 right-6 text-white bg-[#4c5d87] p-4 lg:px-6 rounded-xl shadow-lg cursor-pointer transition hover:bg-slate-700"
     >
      <Add />
      <span className="hidden lg:inline-block">Create</span>
     </button>
     <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
      <NoteForm
       onSave={handleSave}
       initialNote={selectedNote || undefined}
       onDelete={selectedNote ? handleDelete : undefined}
       onCancel={() => {
        setSheetOpen(false)
        setSelectedNote(null)
       }}
      />
     </BottomSheet>
    </>
   )}
  </>
 )
}