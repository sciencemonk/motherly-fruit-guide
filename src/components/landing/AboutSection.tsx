import { Brain } from "lucide-react"

export const AboutSection = () => {
  return (
    <section id="about-us" className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-4xl font-semibold text-sage-800 text-center mb-8">
              About Us
            </h2>
            
            <div className="flex flex-col items-center text-center p-8 bg-sage-50/50 rounded-xl transition-all duration-300 hover:shadow-md">
              <Brain className="w-12 h-12 text-sage-600 mb-6" />
              <p className="text-sage-700 leading-relaxed max-w-2xl">
                Born from a neuroscientist's fascination with consciousness, Ducil combines cutting-edge research with practical 
                techniques to make lucid dreaming accessible to everyone. By merging scientific rigor with modern technology, 
                we've created a platform that helps people unlock their mind's potential through conscious dreaming. Our ongoing 
                research and user feedback continue to drive innovations in consciousness exploration, making Ducil your trusted 
                partner in mastering the art of lucid dreaming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}