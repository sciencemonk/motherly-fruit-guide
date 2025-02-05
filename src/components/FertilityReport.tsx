interface FertilityReportProps {
  firstName?: string;
}

export function FertilityReport({ firstName = "" }: FertilityReportProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-sage-200">
        <h3 className="text-xl font-semibold text-sage-800 mb-4">Fertility Optimization Steps</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sage-700">Track Your Cycle</h4>
            <p className="text-sage-600">Understanding your menstrual cycle is crucial for identifying your fertile window. We'll help you track your cycle and predict your most fertile days using your period information.</p>
          </div>
          <div>
            <h4 className="font-medium text-sage-700">Nutrition</h4>
            <p className="text-sage-600">Focus on a balanced diet rich in folate, iron, and antioxidants. Consider taking prenatal vitamins and maintaining a healthy weight.</p>
          </div>
          <div>
            <h4 className="font-medium text-sage-700">Lifestyle Changes</h4>
            <p className="text-sage-600">Reduce caffeine intake, avoid alcohol, quit smoking, and manage stress through relaxation techniques or gentle exercise.</p>
          </div>
          <div>
            <h4 className="font-medium text-sage-700">Environmental Factors</h4>
            <p className="text-sage-600">Minimize exposure to environmental toxins, avoid excessive heat (like hot tubs), and ensure you're getting adequate sleep.</p>
          </div>
        </div>
      </div>
    </div>
  );
}