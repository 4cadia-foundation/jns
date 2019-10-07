export class BuyDomainRequest {
  constructor(
    public Name: string,
    public TLD: string,
    public StorageHash: string
  ) {}
}
