export class TopLevelDomain {
  public Name: string;
  public Expires: number;

  constructor(name: string, expires: number) {
    this.Name = name;
    this.Expires = expires;
  }
}
