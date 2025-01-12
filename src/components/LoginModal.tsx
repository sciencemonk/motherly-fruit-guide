import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { toast } = useToast()
  const navigate = useNavigate()

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      toast({
        title: "Login successful",
        description: "Welcome back!"
      })
      onClose()
      navigate("/dashboard")
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Morpheus</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#65796B',
                    brandAccent: '#4A5D50',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo="https://motherly-fruit-guide.lovable.app/dashboard"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}