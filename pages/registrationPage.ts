import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { registrationPageLocators } from '../locators/registrationPage.locators';
import type { RegistrationDetails } from '../types';
import { AccountPage } from './accountPage';

export class RegistrationPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(registrationPageLocators.firstNameInput);
    this.lastNameInput = page.locator(registrationPageLocators.lastNameInput);
    this.streetInput = page.locator(registrationPageLocators.streetInput);
    this.cityInput = page.locator(registrationPageLocators.cityInput);
    this.stateInput = page.locator(registrationPageLocators.stateInput);
    this.zipCodeInput = page.locator(registrationPageLocators.zipCodeInput);
    this.phoneNumberInput = page.locator(registrationPageLocators.phoneNumberInput);
    this.ssnInput = page.locator(registrationPageLocators.ssnInput);
    this.usernameInput = page.locator(registrationPageLocators.usernameInput);
    this.passwordInput = page.locator(registrationPageLocators.passwordInput);
    this.repeatPasswordInput = page.locator(registrationPageLocators.repeatPasswordInput);
    this.registerButton = page.locator(registrationPageLocators.registerButton);
    this.successMessage = page.locator(registrationPageLocators.successMessage);
    this.errorMessage = page.locator(registrationPageLocators.errorMessage);
  }

  async goto() {
    await this.navigate('/parabank/register.htm');
  }

  async fillRegistrationForm(details: RegistrationDetails) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.streetInput.fill(details.street);
    await this.cityInput.fill(details.city);
    await this.stateInput.fill(details.state);
    await this.zipCodeInput.fill(details.zipCode);
    await this.phoneNumberInput.fill(details.phoneNumber);
    await this.ssnInput.fill(details.ssn);
    await this.usernameInput.fill(details.username);
    await this.passwordInput.fill(details.password);
    await this.repeatPasswordInput.fill(details.repeatPassword ?? details.password);
  }

  async register(details: RegistrationDetails): Promise<AccountPage> {
    await this.fillRegistrationForm(details);
    await this.registerButton.click();
    return new AccountPage(this.page);
  }

  /** For negative-path tests expecting registration to fail and stay on this page. */
  async submitRegistration(): Promise<void> {
    await this.registerButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent()) ?? '';
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
