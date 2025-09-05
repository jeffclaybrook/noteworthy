import { Note } from "@prisma/client"
import { formatDate } from "@/lib/format-date"
import { Badge } from "./ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

type NoteCardProps = {
 note: Note
 onClick: (note: Note) => void
}

export function NoteCard({
 note,
 onClick
}: NoteCardProps) {
 return (
  <Card
   onClick={() => onClick(note)}
   className="transition-shadow cursor-pointer duration-200 shadow-none hover:shadow-lg"
  >
   <CardHeader>
    <CardTitle className="text-lg/6">{note.title}</CardTitle>
    <CardDescription>{note.description}</CardDescription>
   </CardHeader>
   <CardFooter className="justify-end">
    <Badge variant="secondary">{formatDate(note.updatedAt)}</Badge>
   </CardFooter>
  </Card>
 )
}