import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import { injectable, inject } from 'tsyringe';
import INameService from '../Interface/INameService';
import { TransferTldRequest } from '../../Domain/Entity/TransferTldRequest';

@injectable()
export default class TransferTldValidator extends AbstractValidator<
  TransferTldRequest
> {
  _jnsService: INameService;

  constructor(@inject('INameService') _jnsService: INameService) {
    super();
    this._jnsService = _jnsService;
  }

  public async ValidateTransferTldRequest(
    request: TransferTldRequest
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
