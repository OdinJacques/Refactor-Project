import { Page, Locator } from '@playwright/test';
import { basePageLocators } from '../locators/basePage.locators';

export class BasePage {
  readonly page: Page;
  readonly leftPanel: Locator;
  readonly accountsOverviewLink: Locator;
  readonly openNewAccountLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leftPanel = page.locator(basePageLocators.leftPanel);
    this.accountsOverviewLink = page.locator(basePageLocators.accountsOverviewLink);
    this.openNewAccountLink = page.locator(basePageLocators.openNewAccountLink);
    this.transferFundsLink = page.locator(basePageLocators.transferFundsLink);
    this.billPayLink = page.locator(basePageLocators.billPayLink);
    this.findTransactionsLink = page.locator(basePageLocators.findTransactionsLink);
    this.updateContactInfoLink = page.locator(basePageLocators.updateContactInfoLink);
    this.requestLoanLink = page.locator(basePageLocators.requestLoanLink);
    this.logoutLink = page.locator(basePageLocators.logoutLink);
  }

  async navigate(path: string = '') {
    await this.page.goto(`https://parabank.parasoft.com${path}`);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ── Sidebar helpers (available on every authenticated page) ──────────────

  async goToAccountsOverview() {
    await this.accountsOverviewLink.click();
  }

  async goToOpenNewAccount() {
    await this.openNewAccountLink.click();
  }

  async goToTransferFunds() {
    await this.transferFundsLink.click();
  }

  async goToBillPay() {
    await this.billPayLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async getSidebarText(): Promise<string> {
    return (await this.leftPanel.textContent()) ?? '';
  }
}
