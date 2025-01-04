import { useState } from "react"
import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'url("/lovable-uploads/697b5151-7c43-45fa-983b-768bffef969e.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100vw'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content */}
        <div className="relative h-screen flex items-center">
          <div className="px-4 md:px-6 max-w-[1400px] mx-auto">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4" />
                7-Day Free Trial
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                A new era of pregnancy
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                The world's most advanced pregnancy support guide to help you grow a healthy baby.
              </p>
              
              <Button 
                onClick={() => setShowRegistration(true)}
                className="bg-white hover:bg-white/90 text-sage-800 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar needs to be after the hero section for proper z-indexing */}
      <Navbar />
      
      <Footer />

      {/* Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="p-6">
            <RegistrationForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Index