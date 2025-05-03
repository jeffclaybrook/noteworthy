import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import prisma from "@/lib/prisma"

export async function PUT(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
 }

 const note = await prisma.note.findUnique({
  where: { id }
 })

 if (!note || note.userId !== userId) {
  return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 })
 }

 const { title, content } = await req.json()


 const updated = await prisma.note.update({
  where: { id },
  data: {
   title: encrypt(title),
   content: encrypt(content)
  }
 })

 const decrypted = {
  ...updated,
  title: decrypt(updated.title),
  content: updated.content ? decrypt(updated.content) : null
 }

 return NextResponse.json(decrypted)
}

export async function DELETE(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const url = new URL(req.url)
 const id = url.pathname.split("/").pop()

 if (!id) {
  return NextResponse.json({ error: "Invalid note ID" }, { status: 400 })
 }

 const note = await prisma.note.findUnique({
  where: { id }
 })

 if (!note || note.userId !== userId) {
  return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 })
 }

 await prisma.note.delete({
  where: { id }
 })

 return NextResponse.json({ success: true })
}