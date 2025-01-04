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
        backgroundImage: 'url("/lovable-uploads/03089c7b-a507-445e-84d6-a90b874f6a80.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="container relative z-10 px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-peach-100/90 text-peach-700 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            7-Day Free Trial
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            A new era of pregnancy
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            The world's most advanced pregnancy support guide to help you grow a healthy baby.
          </p>
          
          <Button 
            onClick={onStartTrial}
            className="bg-peach-500 hover:bg-peach-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  )
}