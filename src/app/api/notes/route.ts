import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import prisma from "@/lib/prisma"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const notes = await prisma.note.findMany({
  where: {
   userId
  },
  orderBy: {
   updatedAt: "desc"
  }
 })

 const decrypted = notes.map((note) => ({
  ...note,
  title: decrypt(note.title),
  content: note.content ? decrypt(note.content) : null
 }))

 return NextResponse.json(decrypted)
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { title, content } = await req.json()

 if (
  !title ||
  typeof title !== "string" ||
  title.trim().length === 0
 ) {
  return NextResponse.json({ error: "Title is required" }, { status: 400 })
 }

 const note = await prisma.note.create({
  data: {
   title: encrypt(title),
   content: content ? encrypt(content) : null,
   userId
  }
 })

 const decrypted = {
  ...note,
  title: decrypt(note.title),
  content: note.content ? decrypt(note.content) : null
 }

 return NextResponse.json(decrypted)
}