import crypto from "crypto";

export function generateReminderToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateUnsubscribeToken(userId: string): string {
  // HMAC so you don't need to store it — derive it on demand
  return crypto
    .createHmac("sha256", process.env.REMINDER_SECRET!)
    .update(userId)
    .digest("hex");
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = generateUnsubscribeToken(userId);
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(token)
  );
}