export function SocialProof() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <p className="text-sage-800 font-medium">Sarah</p>
          <p className="text-sage-600 text-sm mt-1">
            "Mother Athena has been incredible during my pregnancy journey. The daily tips and ability to ask questions anytime is so reassuring."
          </p>
          <div className="flex text-peach-400 mt-2">
            {'★'.repeat(5)}
          </div>
        </div>
      </div>
    </div>
  );
}