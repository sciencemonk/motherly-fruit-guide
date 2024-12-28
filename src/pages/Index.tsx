import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Baby, MessageSquare, Brain, Heart } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-8 md:py-16 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            {/* Hero Section */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
                Your Best Friend During Pregnancy
              </h1>
              <p className="text-lg text-sage-700 max-w-2xl mx-auto">
                Track your baby's growth, get expert guidance, and receive weekly updates 
                through our AI-powered text message support. Free to get started!
              </p>
            </div>

            {/* How It Works Section */}
            <div className="grid md:grid-cols-4 gap-8 py-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Track Growth</h3>
                <p className="text-sage-600 text-sm">
                  See your baby's size and development week by week
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Get Support</h3>
                <p className="text-sage-600 text-sm">
                  Text us anytime with your pregnancy questions
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Learn Weekly</h3>
                <p className="text-sage-600 text-sm">
                  Receive updates about your baby's development
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Feel Connected</h3>
                <p className="text-sage-600 text-sm">
                  Stay informed and supported throughout your journey
                </p>
              </div>
            </div>

            {/* Form Section with New Context */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-sage-800 mb-3">
                  Discover Your Baby's Journey
                </h2>
                <p className="text-sage-700">
                  Enter your due date to see your baby's current size and sign up for free weekly updates via text message.
                </p>
              </div>
              
              <RegistrationForm />
            </div>

            {/* Medical Disclaimer */}
            <div className="mt-12 text-center text-sm text-sage-600 px-4">
              <p className="max-w-2xl mx-auto">
                * Mother Athena is not a replacement for professional medical care.
                Always consult with your healthcare provider for medical advice and
                emergency situations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Index