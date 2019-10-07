export class ListDomainByOwnerResult {
    constructor(
        public Name: String,
        public TLD: String,
        public StorageHash: String,
        public Expires: Number
    ) { }
};