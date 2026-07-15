import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { loginPageLocators } from '../locators/loginPage.locators';
import { AccountPage } from './accountPage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(loginPageLocators.usernameInput);
    this.passwordInput = page.locator(loginPageLocators.passwordInput);
    this.loginButton = page.locator(loginPageLocators.loginButton);
    this.errorMessage = page.locator(loginPageLocators.errorMessage);
  }

  async goto() {
    await this.navigate('/parabank/index.htm');
  }

  /** Successful login navigates to the accounts overview, so this chains forward. */
  async login(username: string, password: string): Promise<AccountPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new AccountPage(this.page);
  }

  /** Failed login stays on this page — nothing to chain to. */
  async attemptLogin(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }
}
