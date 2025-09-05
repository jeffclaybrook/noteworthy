"use client"

import { useEffect, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { toast } from "sonner"
import { Note } from "@prisma/client"
import { BottomSheet } from "@/components/BottomSheet"
import { CreateButton } from "@/components/CreateButton"
import { EmptyState } from "@/components/EmptyState"
import { Header } from "@/components/Header"
import { Loader } from "@/components/Loader"
import { NoteForm } from "@/components/NoteForm"
import { NotesList } from "@/components/NotesList"
import { ThemeToggle } from "@/components/ThemeToggle"

type ViewMode = "grid" | "list"

export default function Notes() {
 const [notes, setNotes] = useState<Note[]>([])
 const [view, setView] = useState<ViewMode>("grid")
 const [selectedNote, setSelectedNote] = useState<Note | null>(null)
 const [query, setQuery] = useState<string>("")
 const [isLoading, setIsLoading] = useState<boolean>(true)
 const [sheetOpen, setSheetOpen] = useState<boolean>(false)

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
  const stored = localStorage.getItem("viewMode") as ViewMode
  if (stored === "grid" || stored === "list") {
   setView(stored)
  }
 }, [])

 useEffect(() => {
  localStorage.setItem("viewMode", view)
 }, [view])

 const onToggleView = () => {
  setView((prev) => (prev === "grid" ? "list" : "grid"))
 }

 const sortedNotes = [...notes].sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
 )

 const filteredNotes = sortedNotes.filter(note =>
  note.title?.toLowerCase().includes(query.toLowerCase()) ||
  note.description?.toLowerCase().includes(query.toLowerCase())
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
  if (!selectedNote) {
   return
  }

  try {
   await fetch(`/api/notes/${selectedNote.id}`, {
    method: "DELETE"
   })

   setNotes(notes.filter(note => note.id !== selectedNote.id))
   setSheetOpen(false)
   setSelectedNote(null)
   toast.success("Note deleted successfully!")
  } catch (error) {
   console.error(error)
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

 if (isLoading) {
  return (
   <Loader />
  )
 }

 return (
  <>
   {notes.length === 0 ? (
    <main>
     <header className="flex items-center justify-end gap-2 fixed top-0 left-0 right-0 w-full p-2 lg:px-4 z-50">
      <ThemeToggle />
      <UserButton />
     </header>
     <EmptyState />
    </main>
   ) : (
    <main>
     <Header
      onSearch={setQuery}
      view={view}
      onToggleView={onToggleView}
     />
     {filteredNotes.length === 0 ? (
      <section className="flex items-center justify-center fixed top-0 left-0 h-screen w-full -z-10">
       <p className="text-slate-800 dark:text-slate-100 text-center">No matching notes found.</p>
      </section>
     ) : (
      <NotesList
       notes={filteredNotes}
       view={view}
       onClick={openEditSheet}
      />
     )}
    </main>
   )}
   <CreateButton onClick={openCreateSheet} />
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
 )
}