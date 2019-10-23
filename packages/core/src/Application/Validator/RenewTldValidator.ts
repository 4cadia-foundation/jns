import { AbstractValidator, ValidationResult } from 'fluent-ts-validator';
import INameService from '../Interface/INameService';
import { inject } from 'tsyringe';
import NameServiceConfig from '../../Domain/Entity/NameServiceConfig';
import Bootstrapper from '../../Infra/Bootstrapper';

export default class RenewTldValidator extends AbstractValidator<string> {
  _jnsService: INameService;

  constructor(@inject('NameServiceConfig') _jnsconfig: NameServiceConfig) {
    super();
    this._jnsService = Bootstrapper.Resolve<INameService>('INameService');
  }

  public async ValidateRenewTldRequest(tld: string): Promise<ValidationResult> {
    this.validateIf(i => i)
      .isNotEmpty()
      .isNotNull()
      .withFailureMessage("Top Level Domain can't be empty");

    this.validateIfString(i => i.toString())
      .isAlphanumeric()
      .isLowercase()
      .withFailureMessage(
        'Top level domain must be alphanumeric characters and lower case'
      );

    return this.validate(tld);
  }
}
