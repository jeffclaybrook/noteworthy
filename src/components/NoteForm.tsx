"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Note } from "@prisma/client"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { DeleteIcon } from "./Icons"

const formSchema = z.object({
 title: z.string(),
 description: z.optional(z.string())
})

type NoteFormValues = z.infer<typeof formSchema>

type NoteFormProps = {
 onSave: (note: Note) => void
 onCancel: () => void
 initialNote?: Note
 onDelete?: () => void
}

export function NoteForm({
 onSave,
 onCancel,
 initialNote,
 onDelete
}: NoteFormProps) {
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

 const form = useForm<NoteFormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   title: initialNote?.title || "",
   description: initialNote?.description || ""
  }
 })

 const handleSubmit = async (values: NoteFormValues) => {
  setIsSubmitting(true)

  const method = initialNote ? "PUT" : "POST"
  const url = initialNote ? `/api/notes/${initialNote.id}` : "/api/notes"

  try {
   const res = await fetch(url, {
    method,
    headers: {
     "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
   })

   if (res.ok) {
    const note: Note = await res.json()
    form.reset()
    onSave(note)
    toast.success("Note created successfully!")
   }
  } catch (error) {
   console.error(error)
   toast.error("Uh-oh! Looks like something went wrong")
  } finally {
   setIsSubmitting(false)
  }
 }

 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 max-w-lg w-full mx-auto">
    <h1 className="text-slate-800 dark:text-slate-100 text-center text-2xl">{initialNote ? "Update note" : "Create note"}</h1>
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
         autoFocus
         required
         className="h-12 focus-visible:ring-[1px]"
         {...field}
        />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     control={form.control}
     name="description"
     render={({ field }) => (
      <FormItem>
       <FormLabel>Description</FormLabel>
       <FormControl>
        <Textarea
         placeholder="Description"
         className="min-h-28 focus-visible:ring-[1px]"
         {...field}
        />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <div className="flex items-center justify-end gap-4">
     {onDelete ? (
      <AlertDialog>
       <AlertDialogTrigger asChild>
        <Button
         type="button"
         variant="destructive"
         size="lg"
         aria-label="Delete note"
        >
         <DeleteIcon className="size-6" />
         Delete
        </Button>
       </AlertDialogTrigger>
       <AlertDialogContent>
        <AlertDialogHeader>
         <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
         <AlertDialogDescription>This action cannot be undone and will permanently delete this note.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
         <AlertDialogCancel>Cancel</AlertDialogCancel>
         <AlertDialogAction onClick={() => onDelete?.()}>
          <DeleteIcon className="size-6" />
          Delete
         </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     ) : (
      <Button
       type="button"
       variant="ghost"
       size="lg"
       aria-label="Cancel"
       onClick={onCancel}
      >
       Cancel
      </Button>
     )}
     <Button
      type="submit"
      size="lg"
      disabled={isSubmitting}
      aria-label="Save note"
     >
      {isSubmitting ? "Saving..." : "Save"}
     </Button>
    </div>
   </form>
  </Form>
 )
}