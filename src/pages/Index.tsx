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
              Your Best Friend During Pregnancy
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
                <p className="text-sage-700 mb-6">
                  Mother Athens was born from a personal journey. Our founder, a software engineer, and his wife were expecting 
                  their first child when they realized the need for better pregnancy support. Combining his technical expertise 
                  with their firsthand experience of pregnancy, he created Mother Athens to ensure that all expecting parents 
                  have access to reliable information and support whenever they need it.
                </p>

                <div className="space-y-8 mt-8">
                  <h4 className="text-lg font-semibold text-sage-700">Pregnancy Timeline</h4>
                  
                  <div className="relative">
                    <div className="absolute left-4 h-full w-0.5 bg-sage-300"></div>
                    
                    <div className="space-y-8">
                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <h5 className="font-semibold text-sage-700 mb-2">First Trimester (Weeks 1-12)</h5>
                        <ul className="text-sage-600 space-y-1">
                          <li>• Major organs and structures begin forming</li>
                          <li>• Heart starts beating</li>
                          <li>• Brain and spinal cord development</li>
                          <li>• Facial features begin to form</li>
                        </ul>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <h5 className="font-semibold text-sage-700 mb-2">Second Trimester (Weeks 13-26)</h5>
                        <ul className="text-sage-600 space-y-1">
                          <li>• Baby starts moving and kicking</li>
                          <li>• Gender can be determined</li>
                          <li>• Fingerprints develop</li>
                          <li>• Baby can hear sounds</li>
                        </ul>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <h5 className="font-semibold text-sage-700 mb-2">Third Trimester (Weeks 27-40)</h5>
                        <ul className="text-sage-600 space-y-1">
                          <li>• Rapid brain development</li>
                          <li>• Bones fully develop</li>
                          <li>• Baby gains weight rapidly</li>
                          <li>• Lungs mature for breathing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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