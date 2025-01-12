import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AboutSectionProps {
  onStartTrial?: () => void
}

export const AboutSection = ({ onStartTrial }: AboutSectionProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-sage-50/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl text-center">
            <h2 className="text-4xl font-semibold text-sage-800 mb-4">
              Start Your Journey Today
            </h2>
            
            <p className="text-sage-700 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of dreamers who are discovering the transformative power 
              of lucid dreaming with Morpheus.
            </p>

            <Button 
              onClick={onStartTrial}
              className="bg-sage-500 hover:bg-sage-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Begin Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}