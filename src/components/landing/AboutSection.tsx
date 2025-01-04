import { Baby, Flower } from "lucide-react"

export const AboutSection = () => {
  return (
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
              <Baby className="w-12 h-12 text-sage-500 mb-6" />
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
  )
}