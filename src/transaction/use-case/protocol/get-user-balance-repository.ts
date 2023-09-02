export interface GetUserBalanceRepository {
  getBalance(userId: string): Promise<number>;
}
