export interface EventDispatcher {
  dispatch(event: string, data: any): void;
}
