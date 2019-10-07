import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import { inject } from 'tsyringe';
import NameServiceConfig from '../../Domain/Entity/NameServiceConfig';
import Bootstrapper from '../../Infra/Bootstrapper';
import INameService from '../Interface/INameService';

export default class TopLevelDomainValidator extends AbstractValidator<string> {
  _jnsService: INameService;

  constructor(@inject('NameServiceConfig') _jnsconfig: NameServiceConfig) {
    super();
    this._jnsService = Bootstrapper.Resolve<INameService>('INameService');
  }

  public async ValidateNewTopLevelDomainRequest(
    tld: string
  ): Promise<ValidationResult> {
    this.validateIf(i => i)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Top Level Domain can't be empty");

    this.validateIfString(i => i.toString())
      .hasMinLength(2)
      .hasMaxLength(5)
      .withFailureMessage(
        'Top level Domain must be between two and five characters'
      );

    this.validateIfString(i => i.toString())
      .isAlphanumeric()
      .isLowercase()
      .withFailureMessage(
        'Top level domain must be alphanumeric characters and lower case'
      );

    const isExists = await this._jnsService.IsTopDomainRegistered(tld);
    this.validateIf(() => isExists)
      .isEqualTo(false)
      .withFailureMessage(`Top Level Domain "${tld}" has already registered`);

    return this.validate(tld);
  }
}
