export class Domain {
  constructor(
    public Name: string,
    public TLD: string,
    public StorageHash: string,
    public Expires: number
  ) {}
}
