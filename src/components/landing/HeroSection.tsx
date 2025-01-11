import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface HeroSectionProps {
  onStartTrial: () => void
}

export const HeroSection = ({ onStartTrial }: HeroSectionProps) => {
  return (
    <div 
      className="relative min-h-[90vh] flex items-center mt-16"
      style={{
        backgroundImage: 'url("/lovable-uploads/776c3baf-06f6-45af-b3c7-91ed7804bd25.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="container relative z-10 px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-sage-100/90 text-sage-700 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            7-Day Free Trial
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Master the Art of Lucid Dreaming
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Unlock your mind's potential with Ducil's proven framework for conscious dreaming.
          </p>
          
          <Button 
            onClick={onStartTrial}
            className="bg-sage-500 hover:bg-sage-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  )
}