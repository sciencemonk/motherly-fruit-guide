import { useState } from "react"
import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { ScienceSection } from "@/components/landing/ScienceSection"
import { AboutSection } from "@/components/landing/AboutSection"
import { ContactSection } from "@/components/landing/ContactSection"

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <HeroSection onStartTrial={() => setShowRegistration(true)} />
      <FeaturesSection />
      <ScienceSection />
      <AboutSection />
      <ContactSection />

      <Footer />

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