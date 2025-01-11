import { Brain, Moon, Check, Sparkles, Flower2, BookOpen } from "lucide-react"

export const FeaturesSection = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-sage-500" />,
      title: "Dream Journal",
      description: "Record and analyze your dreams with AI-powered insights"
    },
    {
      icon: <Check className="w-6 h-6 text-sage-500" />,
      title: "Reality Checks",
      description: "Regular reminders to build dream awareness throughout the day"
    },
    {
      icon: <Flower2 className="w-6 h-6 text-sage-500" />,
      title: "Pre-sleep Meditation",
      description: "Guided sessions to enhance dream recall and lucidity"
    },
    {
      icon: <Brain className="w-6 h-6 text-sage-500" />,
      title: "Awareness",
      description: "Learn to recognize dream signs and maintain consciousness"
    },
    {
      icon: <Moon className="w-6 h-6 text-sage-500" />,
      title: "Stabilization",
      description: "Master techniques to stay in lucid dreams longer"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-sage-500" />,
      title: "Control & Exploration",
      description: "Shape your dreams and unlock limitless possibilities"
    }
  ]

  return (
    <section id="features" className="py-24 bg-cream">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-sage-800 mb-6">
            Why Lucid Dreaming Matters
          </h2>
          <p className="text-lg text-sage-600 mb-8 leading-relaxed">
            Lucid dreaming is more than just an fascinating phenomenon—it's a gateway to exploring the depths of human consciousness. 
            By becoming aware within your dreams, you gain the extraordinary ability to explore the vast landscape of your mind from within. 
            This unique state of consciousness allows you to directly experience and interact with your subconscious mind, offering 
            unprecedented opportunities for personal growth, creativity enhancement, and deep self-discovery.
          </p>
          <p className="text-lg text-sage-600 leading-relaxed">
            Whether you're seeking to overcome nightmares, enhance problem-solving abilities, or simply curious about the nature of 
            consciousness itself, lucid dreaming provides a powerful platform for exploration. It's a natural, safe way to expand 
            your awareness and understand the remarkable capabilities of your mind.
          </p>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-800 mb-4">
            Features
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto">
            Our comprehensive approach combines ancient wisdom with modern technology to help you achieve lucidity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center mb-4">
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
  )
}