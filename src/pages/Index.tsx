import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ContactForm } from "@/components/ContactForm"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-cream to-sage-100">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
              Your Best Friend During Pregnancy 🤰
            </h1>
            <p className="text-lg text-sage-700 mb-8">
              Your trusted companion throughout your pregnancy journey. Get weekly updates,
              expert guidance, and peace of mind.
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-sage-700 mb-6">
                Begin Your Journey
              </h2>
              <RegistrationForm />
            </div>

            <div className="mt-16 space-y-8 text-left">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-sage-700 mb-4">
                  How Mother Athens Works
                </h3>
                <p className="text-sage-700 mb-4">
                  Mother Athens brings you 24/7 support and guidance throughout your pregnancy journey through personalized text messages. 
                  Our platform provides weekly updates about your baby's development, answers to your questions, and expert guidance 
                  right at your fingertips.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-sage-700 mb-4">
                  Our Story
                </h3>
                <p className="text-sage-700">
                  Mother Athens was born from a personal journey. Our founder, a software engineer, and his wife were expecting 
                  their first child when they realized the need for better pregnancy support. Combining his technical expertise 
                  with their firsthand experience of pregnancy, he created Mother Athens to ensure that all expecting parents 
                  have access to reliable information and support whenever they need it.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm text-sage-600">
            <p className="max-w-2xl mx-auto">
              * Mother Athens is not a replacement for professional medical care.
              Always consult with your healthcare provider for medical advice and
              emergency situations.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Index