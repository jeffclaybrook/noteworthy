import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { decrypt, encrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"

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
  return NextResponse.json({ error: "Note note found" }, { status: 404 })
 }

 const { title, description } = await req.json()

 const encrypted = await prisma.note.update({
  where: { id },
  data: {
   title: encrypt(title),
   description: encrypt(description)
  }
 })

 const decrypted = {
  ...encrypted,
  title: decrypt(encrypted.title),
  content: encrypted.description ? decrypt(encrypted.description) : null
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
  return NextResponse.json({ error: "Note note found" }, { status: 404 })
 }

 await prisma.note.delete({
  where: { id }
 })

 return NextResponse.json({ success: true })
}