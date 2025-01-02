import { Star } from "lucide-react";

export function SocialProof() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-sage-600">Join thousands of happy mothers who trust Mother Athena</p>
      </div>
      <div className="border rounded-lg p-4 bg-sage-50">
        <div className="text-sage-800 space-y-2">
          <p className="font-medium">Sarah</p>
          <div className="flex justify-center gap-0.5 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-sm italic">"Mother Athena has been incredible during my pregnancy journey. The daily tips and ability to ask questions anytime is so reassuring."</p>
        </div>
      </div>
    </div>
  );
}