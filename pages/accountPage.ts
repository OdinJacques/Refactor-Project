import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { accountPageLocators } from '../locators/accountPage.locators';
import type { AccountType } from '../types';

export class AccountPage extends BasePage {
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly newAccountTypeSelect: Locator;
  readonly openAccountButton: Locator;
  readonly openAccountResult: Locator;
  readonly newAccountIdLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTable = page.locator(accountPageLocators.accountTable);
    this.accountRows = page.locator(accountPageLocators.accountRows);
    this.newAccountTypeSelect = page.locator(accountPageLocators.newAccountTypeSelect);
    this.openAccountButton = page.locator(accountPageLocators.openAccountButton);
    this.openAccountResult = page.locator(accountPageLocators.openAccountResult);
    this.newAccountIdLink = page.locator(accountPageLocators.newAccountIdLink);
  }

  async gotoOverview() {
    await this.navigate('/parabank/overview.htm');
  }

  async gotoOpenAccount() {
    await this.navigate('/parabank/openaccount.htm');
  }

  async getAccountCount(): Promise<number> {
    return this.accountRows.count();
  }

  async getAccountIds(): Promise<string[]> {
    return this.page.locator(accountPageLocators.accountIdLinks).allTextContents();
  }

  async openNewAccount(type: AccountType = 'SAVINGS') {
    const value = type === 'SAVINGS' ? '1' : '0'; // ParaBank: CHECKING=0, SAVINGS=1
    await this.newAccountTypeSelect.selectOption(value);
    await this.openAccountButton.click();
  }

  async getOpenAccountConfirmation(): Promise<string> {
    return (await this.openAccountResult.textContent()) ?? '';
  }

  async getNewAccountId(): Promise<string> {
    return (await this.newAccountIdLink.textContent()) ?? '';
  }
}
