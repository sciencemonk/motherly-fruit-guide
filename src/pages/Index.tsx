import { useState } from "react"
import { RegistrationForm } from "@/components/RegistrationForm"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageCircle, Brain, Heart, Baby, Video, LeafyGreen, Flower } from "lucide-react"

const Index = () => {
  const [showRegistration, setShowRegistration] = useState(false)

  const features = [
    {
      icon: <Baby className="w-6 h-6 text-peach-500" />,
      title: "Daily Updates",
      description: "Receive daily messages about your baby's development"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-peach-500" />,
      title: "24/7 Support",
      description: "Chat anytime with Mother Athena about your pregnancy"
    },
    {
      icon: <Brain className="w-6 h-6 text-peach-500" />,
      title: "Expert Guidance",
      description: "Get evidence-based advice tailored to your journey"
    },
    {
      icon: <Video className="w-6 h-6 text-peach-500" />,
      title: "Community Events",
      description: "Join monthly expert-led sessions on fertility and motherhood"
    },
    {
      icon: <Heart className="w-6 h-6 text-peach-500" />,
      title: "Personalized Care",
      description: "Receive support focused on your specific interests"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-peach-500" />,
      title: "Fertility Support",
      description: "Whether you're expecting or trying to conceive, we're here for you"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
        <div 
          className="relative min-h-[90vh] flex items-center mt-16"
          style={{
            backgroundImage: 'url("/lovable-uploads/03089c7b-a507-445e-84d6-a90b874f6a80.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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

      {/* Features Section */}
        <section className="py-24 bg-cream">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-sage-800 mb-4">
                Comprehensive Support for Your Journey
              </h2>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                From fertility to pregnancy and beyond, we're here to support you every step of the way
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-sage-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sage-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* About Us Section */}
      <section id="about-us" className="py-24 bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-4xl font-semibold text-sage-800 text-center mb-12">
                About Us
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex flex-col items-center text-center p-8 bg-sage-50/50 rounded-xl transition-all duration-300 hover:shadow-md">
                  <Baby className="w-12 h-12 text-sage-600 mb-6" />
                  <p className="text-sage-700 leading-relaxed">
                    Mother Athena was born from a personal journey. Our founder, an engineer, and his wife were expecting 
                    their first child when they realized the need for better pregnancy support.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-8 bg-sage-50/50 rounded-xl transition-all duration-300 hover:shadow-md">
                  <Flower className="w-12 h-12 text-peach-400 mb-6" />
                  <p className="text-sage-700 leading-relaxed">
                    Combining their technical expertise with their firsthand experience of pregnancy, they created Mother Athena 
                    to ensure that all expecting parents have access to reliable information and support whenever they need it.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center p-8 bg-cream/50 rounded-xl transition-all duration-300 hover:shadow-md">
                <LeafyGreen className="w-12 h-12 text-sage-500 mb-6" />
                <p className="text-sage-700 leading-relaxed max-w-2xl">
                  Today, Mother Athena continues to grow and evolve, guided by feedback from our community of parents 
                  and healthcare professionals. We're committed to providing evidence-based guidance and emotional support 
                  throughout every step of the pregnancy journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
