import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { RegistrationForm } from "@/components/RegistrationForm"
import { Sparkles } from "lucide-react"

export const Hero = () => {
  return (
    <div 
      className="relative min-h-screen flex items-center"
      style={{
        backgroundImage: 'url("/lovable-uploads/4e1d9a07-eb10-4bd0-a20d-59eea66c2289.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      
      <div className="relative w-full max-w-3xl pl-8 md:pl-16 lg:pl-24 pr-4">
        <div className="max-w-2xl">
          <div className="flex mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-black text-sm font-['Futura-Md-BT']">
              <Sparkles className="w-4 h-4 mr-2" />
              7-Day Free Trial
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Futura-Md-BT'] font-bold text-black mb-6">
            A new era of pregnancy
          </h1>
          <p className="text-xl text-black font-['Futura-Md-BT'] mb-8">
            The world's most advanced pregnancy support guide to help you grow a healthy baby.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-white hover:bg-gray-50 text-black font-['Futura-Md-BT'] text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
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
    </div>
  )
}