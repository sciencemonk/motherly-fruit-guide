import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LoginModal } from "./LoginModal"
import { useIsMobile } from "@/hooks/use-mobile"
import { supabase } from "@/integrations/supabase/client"

const Navbar = () => {
  const isMobile = useIsMobile()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/1420e5a5-3360-4ab7-9dc2-f184d4774b05.png" 
              alt="Mother Athena Logo" 
              className="w-10 h-10 rounded-full object-cover brightness-0 invert"
            />
            <span className="font-bold text-white">Mother Athena</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-4">
            <Link to="/our-story" className="text-white hover:text-white/80">Our Story</Link>
            <Link to="/contact" className="text-white hover:text-white/80">Contact Us</Link>
          </nav>

          <Button
            variant="outline"
            onClick={() => setIsLoginModalOpen(true)}
            className="border-white text-white hover:bg-white/20 hover:text-white"
          >
            Log In
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