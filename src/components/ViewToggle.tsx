import { Button } from "./ui/button"
import { GridIcon, ListIcon } from "./Icons"

type ViewMode = "grid" | "list"

type ViewToggleProps = {
 view: ViewMode
 onToggleView: () => void
}

export function ViewToggle({
 view,
 onToggleView
}: ViewToggleProps) {
 return (
  <Button
   type="button"
   variant="ghost"
   size="icon"
   aria-label="Toggle view"
   onClick={onToggleView}
  >
   {view === "grid"
    ? <ListIcon className="size-6" />
    : <GridIcon className="size-6" />
   }
   <span className="sr-only">Toggle view</span>
  </Button>
 )
}