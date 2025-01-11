import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Target, Compass } from "lucide-react";

interface FrameworkStepProps {
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function FrameworkStep({
  isLoading,
  onBack,
  onNext
}: FrameworkStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">The Ducil Framework</h2>
        <p className="text-sage-600 mb-6">Our proven approach to mastering lucid dreaming</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Brain className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Awareness</h3>
            <p className="text-sm text-sage-600">Regular reality checks and dream journaling build your awareness of the dream state.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Sparkles className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Stabilization</h3>
            <p className="text-sm text-sage-600">Learn techniques to maintain lucidity and prevent premature awakening.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Target className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Control</h3>
            <p className="text-sm text-sage-600">Master the ability to influence and direct your dreams consciously.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Compass className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Exploration</h3>
            <p className="text-sm text-sage-600">Unlock the full potential of your dreams for personal growth and creativity.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-sage-500 hover:bg-sage-600"
          disabled={isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}