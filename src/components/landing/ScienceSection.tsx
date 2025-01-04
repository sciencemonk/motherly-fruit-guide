import { Brain, TestTube, Microscope, Beaker, ChartLine, Atom } from "lucide-react"

export const ScienceSection = () => {
  return (
    <section id="science" className="py-24 bg-gradient-to-br from-sage-50 to-cream">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sage-800 mb-4">
              The Science Behind Mother Athena
            </h2>
            <p className="text-lg text-sage-600">
              Understanding the interconnected factors that influence fertility and pregnancy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Lifestyle Choices */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
                <TestTube className="w-8 h-8 text-peach-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 text-center mb-4">Lifestyle Choices</h3>
              <ul className="space-y-3 text-sage-600">
                <li className="flex items-start">
                  <Atom className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Balanced nutrition for optimal fertility and fetal development</span>
                </li>
                <li className="flex items-start">
                  <ChartLine className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Regular exercise adapted to each stage of pregnancy</span>
                </li>
                <li className="flex items-start">
                  <Beaker className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Quality sleep patterns for hormonal balance</span>
                </li>
              </ul>
            </div>

            {/* Environment */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
                <Microscope className="w-8 h-8 text-peach-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 text-center mb-4">Environment</h3>
              <ul className="space-y-3 text-sage-600">
                <li className="flex items-start">
                  <TestTube className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Clean water and air quality awareness</span>
                </li>
                <li className="flex items-start">
                  <Beaker className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Non-toxic household products selection</span>
                </li>
                <li className="flex items-start">
                  <Atom className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Safe, breathable fabrics for comfort</span>
                </li>
              </ul>
            </div>

            {/* Mindset */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-peach-500" />
              </div>
              <h3 className="text-xl font-semibold text-sage-800 text-center mb-4">Mindset</h3>
              <ul className="space-y-3 text-sage-600">
                <li className="flex items-start">
                  <ChartLine className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Daily meditation and stress management</span>
                </li>
                <li className="flex items-start">
                  <Microscope className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Positive affirmations and emotional resilience</span>
                </li>
                <li className="flex items-start">
                  <TestTube className="w-5 h-5 text-sage-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Gratitude practice for mental well-being</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-peach-50 flex items-center justify-center mb-6 mx-auto">
              <Microscope className="w-10 h-10 text-peach-500" />
            </div>
            <h3 className="text-2xl font-semibold text-sage-800 mb-4">
              Your Journey to Optimal Health with Mother Athena
            </h3>
            <p className="text-sage-600 max-w-2xl mx-auto leading-relaxed">
              Mother Athena combines cutting-edge research with evidence-based practices to support your journey to motherhood. 
              Our AI-powered guidance system helps you make informed decisions about your lifestyle, environment, 
              and mindset, creating the optimal conditions for conception and a healthy pregnancy. Through 
              personalized daily support and scientifically-backed recommendations, we empower you to nurture your 
              body and mind while creating the perfect environment for your growing baby.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}