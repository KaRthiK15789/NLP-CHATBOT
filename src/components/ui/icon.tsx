import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "@/lib/utils"

interface IconProps {
  icon: IconDefinition
  className?: string
}

export const Icon = ({ icon, className }: IconProps) => (
  <FontAwesomeIcon icon={icon} className={cn("w-4 h-4", className)} />
)
