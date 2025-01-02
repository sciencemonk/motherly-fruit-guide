import { StarRating } from "./StarRating"

export function SocialProof() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-sage-600">Join thousands of happy mothers who trust Mother Athena</p>
      </div>
      <div className="border rounded-lg p-4 bg-sage-50">
        <div className="text-sage-800">
          <p className="font-medium">Sarah</p>
          <StarRating />
          <p className="text-sm italic">"Mother Athena has been incredible during my pregnancy journey. The daily tips and ability to ask questions anytime is so reassuring."</p>
        </div>
      </div>
    </div>
  );
}