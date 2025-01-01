import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Baby, MessageSquare, Brain, Heart, Sparkles } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-8 md:py-16 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            {/* Hero Section */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-peach-100 text-peach-800 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  7-Day Free Trial
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-sage-800 mb-4">
                Your AI Pregnancy Guide
              </h1>
              <p className="text-lg text-sage-700 max-w-2xl mx-auto">
                Get daily personalized pregnancy advice, tips, and guidance through text messages. 
                Start your free 7-day trial today, then continue for just $9.99/month.
              </p>
            </div>

            {/* How It Works Section */}
            <div className="grid md:grid-cols-4 gap-8 py-8">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Daily Updates</h3>
                <p className="text-sage-600 text-sm">
                  Receive daily messages about your baby's development
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">24/7 Support</h3>
                <p className="text-sage-600 text-sm">
                  Chat anytime with Mother Athena about your pregnancy
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Expert Guidance</h3>
                <p className="text-sage-600 text-sm">
                  Get evidence-based advice tailored to your journey
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-peach-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-peach-500" />
                </div>
                <h3 className="font-semibold text-sage-800">Personalized Care</h3>
                <p className="text-sage-600 text-sm">
                  Receive support focused on your specific interests
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-sage-800 mb-3">
                  Start Your Pregnancy Journey
                </h2>
                <p className="text-sage-700">
                  Begin your 7-day free trial and get personalized pregnancy guidance via text message.
                </p>
              </div>
              
              <RegistrationForm />
            </div>

            {/* Pricing Info */}
            <div className="text-center space-y-4">
              <p className="text-sage-700">
                <span className="font-semibold">Free 7-Day Trial</span>, then just{" "}
                <span className="font-semibold">$9.99/month</span>
              </p>
              <p className="text-sm text-sage-600">
                Cancel anytime. No commitment required.
              </p>
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