export class BuyDomainRequest {
    constructor(
        public Name: String,
        public TLD: String,
        public StorageHash: String,
    ) { }
};