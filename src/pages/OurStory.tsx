import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Heart, Baby, Flower, LeafGreen } from "lucide-react"

const OurStory = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-[#e0f2f1] to-sage-100">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <div className="flex items-center justify-center mb-8 space-x-4">
                <Heart className="w-8 h-8 text-peach-400 animate-float" />
                <h1 className="text-4xl font-semibold text-sage-700">Our Story</h1>
                <Heart className="w-8 h-8 text-peach-400 animate-float" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center text-center p-6 bg-sage-50/50 rounded-lg">
                  <Baby className="w-12 h-12 text-sage-600 mb-4" />
                  <p className="text-sage-700">
                    Mother Athena was born from a personal journey. Our founder, an engineer, and his wife were expecting 
                    their first child when they realized the need for better pregnancy support.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 bg-sage-50/50 rounded-lg">
                  <Flower className="w-12 h-12 text-peach-400 mb-4" />
                  <p className="text-sage-700">
                    Combining his technical expertise with their firsthand experience of pregnancy, he created Mother Athena 
                    to ensure that all expecting parents have access to reliable information and support whenever they need it.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-cream/50 rounded-lg">
                <LeafGreen className="w-12 h-12 text-sage-500 mb-4" />
                <p className="text-sage-700 max-w-2xl">
                  Today, Mother Athena continues to grow and evolve, guided by feedback from our community of parents 
                  and healthcare professionals. We're committed to providing evidence-based guidance and emotional support 
                  throughout every step of the pregnancy journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OurStory