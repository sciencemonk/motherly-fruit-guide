interface WelcomeMessageProps {
  firstName: string;
}

export function WelcomeMessage({ firstName }: WelcomeMessageProps) {
  return (
    <div className="text-center text-sage-600 p-4 bg-sage-50 rounded-lg mb-6">
      <h2 className="text-2xl font-semibold text-sage-800 mb-2">Welcome to Mother Athena, {firstName}!</h2>
      <p>📱 Check your phone for your first message from Mother Athena.</p>
    </div>
  );
}