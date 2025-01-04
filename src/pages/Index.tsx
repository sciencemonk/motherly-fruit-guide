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
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div 
          className="absolute inset-0 w-full min-h-screen flex items-center"
          style={{
            backgroundImage: 'url("/lovable-uploads/03089c7b-a507-445e-84d6-a90b874f6a80.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="container relative z-10 px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-peach-100/90 text-peach-700 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
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
                className="bg-peach-500 hover:bg-peach-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </div>
      </main>

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