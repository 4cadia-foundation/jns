import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import INameService from '../Interface/INameService';
import { inject } from 'tsyringe';
import NameServiceConfig from '../../Domain/Entity/NameServiceConfig';
import Bootstrapper from '../../Infra/Bootstrapper';
import { BuyDomainRequest } from '../../Domain/Entity/BuyDomainRequest';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';
import { RenewDomainRequest } from '../../Domain/Entity/RenewDomainRequest';

export default class DomainValidator extends AbstractValidator<
  BuyDomainRequest
> {
  _jnsService: INameService;

  constructor(@inject('NameServiceConfig') _jnsconfig: NameServiceConfig) {
    super();
    this._jnsService = Bootstrapper.Resolve<INameService>('INameService');
  }

  public async ValidateNewDomainRequest(
    request: BuyDomainRequest
  ): Promise<ValidationResult> {
    this.validateIf(a => a.TLD)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Top Level Domain can't be empty");

    this.validateIfString(i => i.TLD.toString())
      .hasMinLength(2)
      .hasMaxLength(5)
      .withFailureMessage(
        'Top level Domain must be between two and five characters'
      );

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
      .hasMinLength(3)
      .withFailureMessage('Domain must be greater than three characters');

    this.validateIfString(i => i.Name.toString())
      .isAlphanumeric()
      .isLowercase()
      .withFailureMessage(
        'Domain must be alphanumeric characters and lower case'
      );

    this.validateIf(a => a.StorageHash)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Storage hash can't be empty");

    this.validateIfString(i => i.StorageHash.toString())
      .hasLength(46)
      .withFailureMessage('Storage hash must be forty-six characters');

    const tldExists = await this._jnsService.IsTopDomainRegistered(request.TLD);
    this.validateIf(() => tldExists)
      .isEqualTo(true)
      .withFailureMessage(`Top Level Domain "${request.TLD}" not registered`);

    const domainExists = await this._jnsService.IsDomainRegisteredSync(
      new DomainExistsRequest(request.Name, request.TLD)
    );
    this.validateIf(() => domainExists)
      .isEqualTo(false)
      .withFailureMessage(
        `Domain "${request.Name}"."${request.TLD}" has already registered`
      );

    return this.validate(request);
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
