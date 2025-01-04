interface WelcomeMessageProps {
  firstName: string;
}

export function WelcomeMessage({ firstName }: WelcomeMessageProps) {
  return (
    <div className="text-center text-sage-600 p-4 bg-sage-50 rounded-lg mb-6">
      <p>📱 Hello {firstName}, check your phone for a welcome message from Mother Athena!</p>
    </div>
  );
}