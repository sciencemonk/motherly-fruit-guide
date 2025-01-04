import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LoginModal } from "./LoginModal"
import { useIsMobile } from "@/hooks/use-mobile"

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
          <nav className="hidden md:flex space-x-4">
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
          </nav>

          <Button
            variant="outline"
            onClick={() => setIsLoginModalOpen(true)}
            className="hover:bg-sage-50"
          >
            Contact Us
          </Button>
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