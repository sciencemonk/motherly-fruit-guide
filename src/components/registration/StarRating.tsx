import { Star } from "lucide-react"

export function StarRating() {
  return (
    <div className="flex justify-center gap-1 my-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-peach-400 text-peach-400"
        />
      ))}
    </div>
  )
}