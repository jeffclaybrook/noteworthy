import { useMediaQuery } from "usehooks-ts"
import { Button } from "./ui/button"
import { AddIcon } from "./Icons"

type CreateButtonProps = {
 onClick: () => void
}

export function CreateButton({ onClick }: CreateButtonProps) {
 const isMobile = useMediaQuery("(max-width: 1024px)", {
  initializeWithValue: false
 })

 return (
  <Button
   type="button"
   size={isMobile ? "sm" : "lg"}
   aria-label="Create note"
   onClick={onClick}
   className="fixed bottom-6 right-6 z-50"
  >
   <AddIcon className="size-6" />
   <span className={isMobile ? "hidden" : "inline-block"}>Create</span>
  </Button>
 )
}