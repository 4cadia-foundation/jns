import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import { RenewDomainRequest } from '../../Domain/Entity/RenewDomainRequest';
import INameService from '../Interface/INameService';
import { inject } from 'tsyringe';
import NameServiceConfig from '../../Domain/Entity/NameServiceConfig';
import Bootstrapper from '../../Infra/Bootstrapper';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';

export default class RenewDomainValidator extends AbstractValidator<
  RenewDomainRequest
> {
  _jnsService: INameService;

  constructor(@inject('NameServiceConfig') _jnsconfig: NameServiceConfig) {
    super();
    this._jnsService = Bootstrapper.Resolve<INameService>('INameService');
  }

  public async ValidateRenewDomainRequest(
    request: RenewDomainRequest
  ): Promise<ValidationResult> {
    this.validateIf(a => a.TLD)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Top Level Domain can't be empty");

    this.validateIfString(i => i.TLD.toString())
      .isAlphanumeric()
      .isLowercase()
      .withFailureMessage(
        'Top level domain must be alphanumeric characters and lower case'
      );

    this.validateIf(a => a.Name)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Domain can't be empty");

    this.validateIfString(i => i.Name.toString())
      .isAlphanumeric()
      .isLowercase()
      .withFailureMessage(
        'Domain must be alphanumeric characters and lower case'
      );

    const tldExists = await this._jnsService.IsTopDomainRegistered(request.TLD);
    this.validateIf(() => tldExists)
      .isEqualTo(true)
      .withFailureMessage(`Top Level Domain "${request.TLD}" not registered`);

    const domainExists = await this._jnsService.IsDomainRegisteredSync(
      new DomainExistsRequest(request.Name, request.TLD)
    );
    this.validateIf(() => domainExists)
      .isEqualTo(true)
      .withFailureMessage(
        `Domain "${request.Name}"."${request.TLD}" not registered`
      );

    return this.validate(request);
  }
}
