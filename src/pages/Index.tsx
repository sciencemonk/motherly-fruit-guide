import { useState } from "react"
import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { AboutSection } from "@/components/landing/AboutSection"
import { ContactSection } from "@/components/landing/ContactSection"

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <HeroSection onStartTrial={() => setShowRegistration(true)} />
      <FeaturesSection />
      <AboutSection onStartTrial={() => setShowRegistration(true)} />
      <ContactSection />

      <Footer />

      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogTitle className="sr-only">Start Your Journey with Morpheus</DialogTitle>
          <div className="p-6">
            <RegistrationForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Index