import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';
import { TransferFundsPage } from '../pages/transferFundsPage';
import { buildRegistrationDetails } from './utils/registrationData';

test.describe('Transfer Funds', () => {
  let transferFundsPage: TransferFundsPage;

  test.beforeEach(async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    const accountPage = await registrationPage.register(buildRegistrationDetails());

    // Open a second account so there's somewhere to transfer to.
    const openAccountPage = await accountPage.sidebar.goToOpenNewAccount(); // chained
    await openAccountPage.openNewAccount('SAVINGS');
    const overviewPage = await openAccountPage.sidebar.goToAccountsOverview(); // chained

    transferFundsPage = await overviewPage.sidebar.goToTransferFunds(); // chained
  });

  test('Transfer form fields are displayed', async () => {
    await expect(transferFundsPage.amountInput).toBeVisible();
    await expect(transferFundsPage.fromAccountSelect).toBeVisible();
    await expect(transferFundsPage.toAccountSelect).toBeVisible();
    await expect(transferFundsPage.transferButton).toBeVisible();
  });

  test('Transferring funds between own accounts shows a confirmation', async () => {
    await transferFundsPage.transfer({ amount: '100' });

    const heading = await transferFundsPage.getConfirmationHeading();
    expect(heading).toContain('Transfer Complete!');
  });

  test('Sidebar remains available on the transfer confirmation page', async () => {
    await transferFundsPage.transfer({ amount: '50' });

    const sidebarText = await transferFundsPage.sidebar.getSidebarText();
    expect(sidebarText).toContain('Transfer Funds');
    expect(sidebarText).toContain('Log Out');
  });
});
