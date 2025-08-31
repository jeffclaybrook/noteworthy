import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const notes = await prisma.note.findMany({
  where: { userId },
  orderBy: {
   updatedAt: "desc"
  }
 })

 const decrypted = notes.map((note) => ({
  ...note,
  title: decrypt(note.title),
  description: note.description ? decrypt(note.description) : null
 }))

 return NextResponse.json(decrypted)
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const { title, description } = await req.json()

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
   description: description ? encrypt(description) : null,
   userId
  }
 })

 const decrypted = {
  ...note,
  title: decrypt(note.title),
  description: note.description ? decrypt(note.description) : null
 }

 return NextResponse.json(decrypted)
}