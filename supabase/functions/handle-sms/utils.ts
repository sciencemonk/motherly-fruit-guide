export function createTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}

export function calculateGestationalAge(dueDate: string): number | undefined {
  if (!dueDate) return undefined;
  
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  const diffTime = dueDateObj.getTime() - today.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return 40 - diffWeeks;
}