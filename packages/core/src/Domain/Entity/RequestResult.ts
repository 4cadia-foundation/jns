export class RequestResult {
  public TxHash = '';
  public Result: Record<string, any>[] = [];
  public Errors: string[] = [];
  public Success = false;
}
