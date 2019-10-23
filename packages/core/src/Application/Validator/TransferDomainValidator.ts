import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import INameService from '../Interface/INameService';
import { inject } from 'tsyringe';
import NameServiceConfig from '../../Domain/Entity/NameServiceConfig';
import Bootstrapper from '../../Infra/Bootstrapper';
import { TransferDomainRequest } from '../../Domain/Entity/TransferDomainRequest';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';

export default class TransferDomainValidator extends AbstractValidator<
  TransferDomainRequest
> {
  _jnsService: INameService;

  constructor(@inject('NameServiceConfig') _jnsconfig: NameServiceConfig) {
    super();
    this._jnsService = Bootstrapper.Resolve<INameService>('INameService');
  }

  public async ValidateTransferDomainRequest(
    request: TransferDomainRequest
  ): Promise<ValidationResult> {
    this.validateIf(item => item.domain)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage('Domain cannot be empty.');

    this.validateIf(item => item.tld)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage('TLD cannot be empty.');

    this.validateIf(item => item.newOwnerAddress)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage('New owner address cannot be empty.');

    return this.validate(request);
  }
}
