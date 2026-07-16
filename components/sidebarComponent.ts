import { Page, Locator } from '@playwright/test';
import { sidebarComponentLocators } from '../locators/sidebarComponent.locators';
import { AccountPage } from '../pages/accountPage';
import { TransferFundsPage } from '../pages/transferFundsPage';
import { LoginPage } from '../pages/loginPage';

/**
 * The #leftPanel sidebar nav (Accounts Overview / Open New Account /
 * Transfer Funds / Bill Pay / Log Out) renders identically on every
 * authenticated ParaBank page. Modeled once here and composed into each
 * page object as `this.sidebar` (see AccountPage, TransferFundsPage),
 * rather than repeating these locators per page.
 *
 * Unlike BasePage, this is safe to import AccountPage/TransferFundsPage/
 * LoginPage from: this class doesn't get extended by them, it's composed
 * *into* them, so there's no circular `extends` at module-load time.
 */
export class SidebarComponent {
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
    this.leftPanel = page.locator(sidebarComponentLocators.leftPanel);
    this.accountsOverviewLink = page.locator(sidebarComponentLocators.accountsOverviewLink);
    this.openNewAccountLink = page.locator(sidebarComponentLocators.openNewAccountLink);
    this.transferFundsLink = page.locator(sidebarComponentLocators.transferFundsLink);
    this.billPayLink = page.locator(sidebarComponentLocators.billPayLink);
    this.findTransactionsLink = page.locator(sidebarComponentLocators.findTransactionsLink);
    this.updateContactInfoLink = page.locator(sidebarComponentLocators.updateContactInfoLink);
    this.requestLoanLink = page.locator(sidebarComponentLocators.requestLoanLink);
    this.logoutLink = page.locator(sidebarComponentLocators.logoutLink);
  }

  async goToAccountsOverview(): Promise<AccountPage> {
    await this.accountsOverviewLink.click();
    return new AccountPage(this.page);
  }

  async goToOpenNewAccount(): Promise<AccountPage> {
    await this.openNewAccountLink.click();
    return new AccountPage(this.page);
  }

  async goToTransferFunds(): Promise<TransferFundsPage> {
    await this.transferFundsLink.click();
    return new TransferFundsPage(this.page);
  }

  async goToBillPay() {
    await this.billPayLink.click();
  }

  async logout(): Promise<LoginPage> {
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }

  async getSidebarText(): Promise<string> {
    return (await this.leftPanel.textContent()) ?? '';
  }
}
