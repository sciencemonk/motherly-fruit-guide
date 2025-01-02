import { Link } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const isMobile = useIsMobile()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/1420e5a5-3360-4ab7-9dc2-f184d4774b05.png" 
              alt="Mother Athena Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold">Mother Athena</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white">
                <DropdownMenuItem asChild>
                  <Link to="/our-story" className="w-full">Our Story</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="w-full">Contact Us</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden md:flex space-x-4">
              <Link to="/our-story" className="text-sage-700 hover:text-sage-900">Our Story</Link>
              <Link to="/contact" className="text-sage-700 hover:text-sage-900">Contact Us</Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar