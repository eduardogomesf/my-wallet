export interface UseCaseResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}
