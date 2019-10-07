export class RequestResult {
  public TxHash: string;
  public Result: Record<string, any>[] = [];
  public Errors: Record<string, any>[] = [];
  public Success = false;
}
