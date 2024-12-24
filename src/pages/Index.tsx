import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
                Your Best Friend During Pregnancy
              </h1>
              <p className="text-lg text-sage-700">
                Your trusted companion throughout your pregnancy journey. Get weekly updates,
                expert guidance, and peace of mind. Free of charge.
              </p>
            </div>
            
            <RegistrationForm />

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-sage-700 mb-4">
                How Mother Athena Works
              </h3>
              <p className="text-sage-700">
                Mother Athena brings you 24/7 support and guidance throughout your pregnancy journey through personalized text messages. 
                Our platform provides weekly updates about your baby's development, answers to your questions, and expert guidance 
                right at your fingertips.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm text-sage-600">
            <p className="max-w-2xl mx-auto">
              * Mother Athena is not a replacement for professional medical care.
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