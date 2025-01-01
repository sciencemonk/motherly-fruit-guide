import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { RegistrationForm } from "@/components/RegistrationForm"
import { Sparkles } from "lucide-react"

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Left side content */}
      <div className="w-1/2 pl-8 md:pl-16 lg:pl-24 pr-4">
        <div className="max-w-2xl">
          <div className="flex mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-peach-100 text-peach-800 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              7-Day Free Trial
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-sage-800 mb-6">
            A new era of pregnancy care
          </h1>
          <p className="text-xl text-sage-700 mb-8">
            Your personal AI pregnancy guide, providing daily advice and support to help you grow a healthy baby.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-peach-400 hover:bg-peach-500 text-peach-900 font-semibold text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              >
                Start Your Free Trial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0">
              <div className="p-6">
                <RegistrationForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Right side image */}
      <div className="absolute right-0 top-0 w-1/2 h-full">
        <div className="relative h-full">
          <img
            src="/lovable-uploads/4e1d9a07-eb10-4bd0-a20d-59eea66c2289.png"
            alt="Pregnant woman meditating"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/90" />
        </div>
      </div>
    </div>
  )
}