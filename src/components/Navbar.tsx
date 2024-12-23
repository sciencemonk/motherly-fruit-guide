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
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/1420e5a5-3360-4ab7-9dc2-f184d4774b05.png" 
              alt="Mother Athena Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold">Mother Athena</span>
          </Link>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsLoginModalOpen(true)}
          className="hover:bg-sage-50"
        >
          Log In
        </Button>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default Navbar