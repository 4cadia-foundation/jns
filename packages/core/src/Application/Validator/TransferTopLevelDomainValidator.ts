import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import { injectable, inject } from 'tsyringe';
import INameService from '../Interface/INameService';
import { TransferTopLevelDomainRequest } from '../../Domain/Entity/TransferTopLevelDomainRequest';

@injectable()
export default class TransferTopLevelDomainValidator extends AbstractValidator<
  TransferTopLevelDomainRequest
> {
  _jnsService: INameService;

  constructor(@inject('INameService') _jnsService: INameService) {
    super();
    this._jnsService = _jnsService;
  }

  public async ValidateTransferTopLevelDomainRequest(
    request: TransferTopLevelDomainRequest
  ): Promise<ValidationResult> {
    this.validateIf(({ name }) => name)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Top Level Domain can't be empty");

    this.validateIf(({ newOwnerAddress }) => newOwnerAddress)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Top Level Domain can't be empty");

    const isExists = await this._jnsService.IsTopDomainRegistered(request.name);
    this.validateIf(() => isExists)
      .isEqualTo(true)
      .withFailureMessage(
        `TLD "${request.name}" cannot be transfered because it's not registered yet`
      );

    return this.validate(request);
  }
}
