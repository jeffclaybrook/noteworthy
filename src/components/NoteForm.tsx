"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Note } from "@prisma/client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Delete } from "./Icons"

const formSchema = z.object({
 title: z.string(),
 content: z.optional(z.string())
})

type NoteFormValues = z.infer<typeof formSchema>

type NoteFormProps = {
 onSave: (note: Note) => void
 onCancel: () => void
 initialNote?: Note
 onDelete?: () => void
}

export function NoteForm({ onSave, onCancel, initialNote, onDelete }: NoteFormProps) {
 const [isLoading, setIsLoading] = useState<boolean>(false)
 const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

 const form = useForm<NoteFormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   title: initialNote?.title || "",
   content: initialNote?.content || ""
  }
 })

 const handleSubmit = async (values: NoteFormValues) => {
  setIsLoading(true)

  const method = initialNote ? "PUT" : "POST"
  const url = initialNote ? `/api/notes/${initialNote.id}` : "/api/notes"

  try {
   const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
   })

   if (res.ok) {
    const note: Note = await res.json()
    form.reset()
    onSave(note)
    toast.success("Note saved successfully!")
   }
  } catch (error) {
   console.error("Something went wrong:", error)
   toast.error("Uh-oh! Looks like something went wrong")
  } finally {
   setIsLoading(false)
  }
 }

 return (
  <>
   <div className="flex flex-col gap-4 max-w-lg mx-auto">
    <h1 className="text-slate-800 text-center text-2xl">Note</h1>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 w-full">
      <FormField
       control={form.control}
       name="title"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Title</FormLabel>
         <FormControl>
          <Input
           type="text"
           placeholder="Title"
           {...field}
          />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <FormField
       control={form.control}
       name="content"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Content</FormLabel>
         <FormControl>
          <Textarea
           placeholder="Note"
           rows={6}
           {...field}
          />
         </FormControl>
        </FormItem>
       )}
      />
      <div className="flex items-center justify-end gap-4">
       {onDelete ? (
        <button
         type="button"
         onClick={() => setShowDeleteModal(true)}
         aria-label="Delete note"
         className="inline-flex items-center justify-center gap-1 py-2 px-4 text-red-500 cursor-pointer transition hover:text-red-700"
        >
         <Delete />
         Delete
        </button>
       ) : (
        <button
         type="button"
         onClick={onCancel}
         aria-label="Cancel"
         className="text-gray-500 cursor-pointer transition py-2 px-4 hover:text-gray-700"
        >
         Cancel
        </button>
       )}
       <button
        type="submit"
        aria-label="Save note"
        disabled={isLoading}
        className="text-white bg-[#4c5d87] py-2 px-6 rounded-full cursor-pointer transition shadow-lg hover:bg-slate-600"
       >
        {isLoading ? "Saving..." : "Save"}
       </button>
      </div>
     </form>
    </Form>
   </div>
   {showDeleteModal && (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
     <DialogContent className="max-w-sm">
      <DialogHeader>
       <DialogTitle className="text-slate-800 text-start">Delete Note</DialogTitle>
       <DialogDescription className="text-slate-600 text-sm">Are you sure you want to delete this note?</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-row items-center justify-end gap-2">
       <button
        onClick={() => setShowDeleteModal(false)}
        aria-label="Cancel"
        className="text-gray-500 cursor-pointer transition py-2 px-4 hover:text-gray-700"
       >
        Cancel
       </button>
       <button
        onClick={() => {
         setShowDeleteModal(false)
         onDelete?.()
        }}
        aria-label="Delete note"
        className="inline-flex items-center justify-center gap-1 py-2 px-4 text-red-500 cursor-pointer transition hover:text-red-700"
       >
        <Delete />
        Delete
       </button>
      </DialogFooter>
     </DialogContent>
    </Dialog>
   )}
  </>
 )
}