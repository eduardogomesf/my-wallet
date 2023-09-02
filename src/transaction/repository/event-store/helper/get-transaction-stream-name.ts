export function getTransactionStreamName(userId: string): string {
  return `user-${userId}-transaction`;
}
