import { formatDistanceToNow } from "date-fns"
import { Note } from "@prisma/client"

type CardProps = {
 note: Note
 onClick: (note: Note) => void
}

export function Card({ note, onClick }: CardProps) {
 return (
  <li onClick={() => onClick(note)} className="border border-slate-200 p-4 rounded-lg transition duration-100 cursor-pointer hover:shadow-lg">
   <h2 className="text-slate-800 text-lg/6 font-semibold mb-2">{note.title}</h2>
   <p className="text-slate-600 mb-1">{note.content}</p>
   <span className="text-slate-400 text-sm">{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
  </li>
 )
}