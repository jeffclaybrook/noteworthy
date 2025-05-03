import { Note } from "@prisma/client"
import { Card } from "./Card"

type ListProps = {
 notes: Note[]
 viewMode: "grid" | "list"
 onClick: (note: Note) => void
}

export function List({ notes, viewMode, onClick }: ListProps) {
 return (
  <ul className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 lg:gap-4 lg:p-4 mt-16" : "flex flex-col gap-2 p-2 lg:gap-4 lg:p-4 mt-16"}>
   {notes.map((note) => (
    <Card
     key={note.id}
     note={note}
     onClick={onClick}
    />
   ))}
  </ul>
 )
}