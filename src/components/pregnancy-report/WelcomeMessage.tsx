interface WelcomeMessageProps {
  firstName: string;
}

export function WelcomeMessage({ firstName }: WelcomeMessageProps) {
  return (
    <div className="text-center text-sage-600 p-4 bg-sage-50 rounded-lg mb-6">
      <p>📱 Hello {firstName}, check your phone for a welcome message from Ducil!</p>
      
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold text-sage-800 mb-4">The Ducil Framework</h2>
        <p className="text-sage-600 mb-6">Our proven approach to mastering lucid dreaming</p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Awareness</h3>
              <p className="text-sm text-sage-600">Regular reality checks and dream journaling build your awareness of the dream state.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Stabilization</h3>
              <p className="text-sm text-sage-600">Learn techniques to maintain lucidity and prevent premature awakening.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Control</h3>
              <p className="text-sm text-sage-600">Master the ability to influence and direct your dreams consciously.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div>
              <h3 className="font-medium text-sage-800">Exploration</h3>
              <p className="text-sm text-sage-600">Unlock the full potential of your dreams for personal growth and creativity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}