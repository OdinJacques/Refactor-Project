import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';
import { AccountPage } from '../pages/accountPage';
import { buildRegistrationDetails } from './utils/registrationData';

test.describe('Account', () => {
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    accountPage = await registrationPage.register(buildRegistrationDetails());
  });

  test('Overview lists exactly one checking account after registration', async () => {
    expect(await accountPage.getAccountCount()).toBe(1);
  });

  test('Sidebar exposes all account actions', async () => {
    const sidebarText = await accountPage.getSidebarText();
    expect(sidebarText).toContain('Accounts Overview');
    expect(sidebarText).toContain('Open New Account');
    expect(sidebarText).toContain('Transfer Funds');
    expect(sidebarText).toContain('Bill Pay');
    expect(sidebarText).toContain('Log Out');
  });

  test('Opening a new savings account adds it to the overview', async () => {
    await accountPage.goToOpenNewAccount();
    await accountPage.openNewAccount('SAVINGS');

    const confirmation = await accountPage.getOpenAccountConfirmation();
    expect(confirmation).toContain('Congratulations');

    await accountPage.goToAccountsOverview();
    expect(await accountPage.getAccountCount()).toBe(2);
  });

  test('Newly opened account id appears in the accounts list', async () => {
    await accountPage.goToOpenNewAccount();
    await accountPage.openNewAccount('SAVINGS');

    const newAccountId = await accountPage.getNewAccountId();
    await accountPage.goToAccountsOverview();

    const accountIds = await accountPage.getAccountIds();
    expect(accountIds).toContain(newAccountId);
  });

  test('Logging out returns to the public login page', async ({ page }) => {
    await accountPage.logout();
    await expect(page.locator('input[value="Log In"]')).toBeVisible();
  });
});
