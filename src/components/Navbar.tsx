import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LoginModal } from "./LoginModal"
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const NavLinks = () => (
    <>
      <Link to="/" className="text-sage-700 hover:text-sage-900">Home</Link>
      <a 
        href="#features" 
        onClick={(e) => scrollToSection(e, 'features')} 
        className="text-sage-700 hover:text-sage-900"
      >
        Features
      </a>
      <a 
        href="#science" 
        onClick={(e) => scrollToSection(e, 'science')} 
        className="text-sage-700 hover:text-sage-900"
      >
        The Science
      </a>
      <a 
        href="#about-us" 
        onClick={(e) => scrollToSection(e, 'about-us')} 
        className="text-sage-700 hover:text-sage-900"
      >
        About Us
      </a>
    </>
  )

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/083f2b6d-1d79-4672-9c90-f99eb0fffdcf.png" 
              alt="Mother Athena Icon" 
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-xl font-medium text-sage-800" style={{ fontFamily: 'Futura, sans-serif' }}>
              Mother Athena
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/" className="w-full">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="#features" 
                    onClick={(e) => scrollToSection(e, 'features')}
                    className="w-full"
                  >
                    Features
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="#science" 
                    onClick={(e) => scrollToSection(e, 'science')}
                    className="w-full"
                  >
                    The Science
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="#about-us" 
                    onClick={(e) => scrollToSection(e, 'about-us')}
                    className="w-full"
                  >
                    About Us
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full justify-start hover:bg-sage-50"
                  >
                    Log In
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <nav className="hidden md:flex space-x-4">
                <NavLinks />
              </nav>
              <Button
                variant="outline"
                onClick={() => setIsLoginModalOpen(true)}
                className="hover:bg-sage-50"
              >
                Log In
              </Button>
            </>
          )}
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default Navbar