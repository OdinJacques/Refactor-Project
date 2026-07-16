import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { transferFundsPageLocators } from '../locators/transferFundsPage.locators';
import { SidebarComponent } from '../components/sidebarComponent';
import type { TransferFundsDetails } from '../types';

export class TransferFundsPage extends BasePage {
  readonly sidebar: SidebarComponent;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly resultHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = new SidebarComponent(page);
    this.amountInput = page.locator(transferFundsPageLocators.amountInput);
    this.fromAccountSelect = page.locator(transferFundsPageLocators.fromAccountSelect);
    this.toAccountSelect = page.locator(transferFundsPageLocators.toAccountSelect);
    this.transferButton = page.locator(transferFundsPageLocators.transferButton);
    this.resultHeading = page.locator(transferFundsPageLocators.resultHeading);
  }

  async goto() {
    await this.navigate('/parabank/transfer.htm');
  }

  async transfer(details: TransferFundsDetails) {
    await this.amountInput.fill(details.amount);
    await this.fromAccountSelect.selectOption({ index: details.fromAccountIndex ?? 0 });
    await this.toAccountSelect.selectOption({ index: details.toAccountIndex ?? 1 });
    await this.transferButton.click();
  }

  async getConfirmationHeading(): Promise<string> {
    return (await this.resultHeading.textContent()) ?? '';
  }
}
