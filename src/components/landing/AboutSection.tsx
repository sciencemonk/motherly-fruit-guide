import { Brain, Sparkles } from "lucide-react"

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
                <Brain className="w-12 h-12 text-sage-600 mb-6" />
                <p className="text-sage-700 leading-relaxed">
                  Ducil was born from a neuroscientist's fascination with consciousness and the untapped potential 
                  of the dreaming mind. Our founder's research into the nature of reality and consciousness led to 
                  groundbreaking insights about lucid dreaming.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 bg-sage-50/50 rounded-xl transition-all duration-300 hover:shadow-md">
                <Sparkles className="w-12 h-12 text-sage-600 mb-6" />
                <p className="text-sage-700 leading-relaxed">
                  By combining scientific rigor with practical techniques and modern technology, we've created a 
                  platform that makes lucid dreaming accessible to everyone, opening new frontiers in consciousness 
                  exploration.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-cream/50 rounded-xl transition-all duration-300 hover:shadow-md">
              <Brain className="w-12 h-12 text-sage-500 mb-6" />
              <p className="text-sage-700 leading-relaxed max-w-2xl">
                Today, Ducil continues to evolve through ongoing research and user feedback. We're committed to 
                advancing our understanding of consciousness while helping people unlock their mind's potential 
                through lucid dreaming. Join us in exploring the frontiers of human consciousness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}