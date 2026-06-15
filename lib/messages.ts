export function normalizeMessage(value: string) {
  const message = value.trim();

  if (!message) {
    throw new Error("Enter a message");
  }

  if (message.length > 160) {
    throw new Error("Use 160 characters or fewer");
  }

  return message;
}
