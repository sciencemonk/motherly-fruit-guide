import { Brain, TestTube, Microscope, Beaker, ChartLine, Atom } from "lucide-react"

export const ScienceSection = () => {
  return (
    <section id="science" className="py-24 bg-gradient-to-br from-sage-50 to-cream">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sage-800 mb-4">
              The Science Behind Lucid Dreaming
            </h2>
            <p className="text-lg text-sage-600">
              Understanding the neuroscience and psychology of conscious dreaming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Brain Activity */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-peach-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 text-center mb-4">Brain Activity</h3>
              <ul className="space-y-3 text-sage-600">
                <li className="flex items-start">
                  <Atom className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Increased activity in prefrontal cortex during lucidity</span>
                </li>
                <li className="flex items-start">
                  <ChartLine className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Enhanced gamma wave patterns</span>
                </li>
                <li className="flex items-start">
                  <Beaker className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>REM sleep optimization</span>
                </li>
              </ul>
            </div>

            {/* Consciousness */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
                <Microscope className="w-8 h-8 text-peach-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 text-center mb-4">Consciousness</h3>
              <ul className="space-y-3 text-sage-600">
                <li className="flex items-start">
                  <TestTube className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Meta-cognitive awareness during dreams</span>
                </li>
                <li className="flex items-start">
                  <Beaker className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Self-reflection in dream state</span>
                </li>
                <li className="flex items-start">
                  <Atom className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Enhanced memory consolidation</span>
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-peach-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 text-center mb-4">Benefits</h3>
              <ul className="space-y-3 text-sage-600">
                <li className="flex items-start">
                  <ChartLine className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Reduced anxiety and nightmares</span>
                </li>
                <li className="flex items-start">
                  <Microscope className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Enhanced problem-solving abilities</span>
                </li>
                <li className="flex items-start">
                  <TestTube className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Improved creativity and imagination</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
              <Microscope className="w-10 h-10 text-peach-500" />
            </div>
            <h3 className="text-2xl font-semibold text-sage-800 mb-4">
              Advancing Dream Research with Ducil
            </h3>
            <p className="text-sage-600 max-w-2xl mx-auto leading-relaxed">
              Ducil combines cutting-edge neuroscience research with practical techniques to help you achieve 
              and maintain lucidity in your dreams. Our AI-powered system analyzes your dream patterns and 
              provides personalized guidance to optimize your practice. Through scientifically-validated methods 
              and continuous monitoring, we help you unlock the full potential of your consciousness during sleep.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}