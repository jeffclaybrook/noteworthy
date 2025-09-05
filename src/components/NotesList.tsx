import { Note } from "@prisma/client"
import { NoteCard } from "./NoteCard"

type ViewMode = "grid" | "list"

type NotesListProps = {
 notes: Note[]
 view: ViewMode
 onClick: (note: Note) => void
}

export function NotesList({
 notes,
 view = "grid",
 onClick
}: NotesListProps) {
 return (
  <section
   className={view === "grid"
    ? "grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 lg:gap-4 lg:p-4 mt-16"
    : "flex flex-col gap-2 p-2 lg:gap-4 lg:py-4 lg:px-0 my-16 mx-auto max-w-xl w-full"
   }
  >
   {notes.map((note) => (
    <NoteCard
     key={note.id}
     note={note}
     onClick={onClick}
    />
   ))}
  </section>
 )
}