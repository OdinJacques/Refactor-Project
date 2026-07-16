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
    const sidebarText = await accountPage.sidebar.getSidebarText();
    expect(sidebarText).toContain('Accounts Overview');
    expect(sidebarText).toContain('Open New Account');
    expect(sidebarText).toContain('Transfer Funds');
    expect(sidebarText).toContain('Bill Pay');
    expect(sidebarText).toContain('Log Out');
  });

  test('Opening a new savings account adds it to the overview', async () => {
    const openAccountPage = await accountPage.sidebar.goToOpenNewAccount(); // chained
    await openAccountPage.openNewAccount('SAVINGS');

    const confirmation = await openAccountPage.getOpenAccountConfirmation();
    expect(confirmation).toContain('Congratulations');

    const overviewPage = await openAccountPage.sidebar.goToAccountsOverview(); // chained
    expect(await overviewPage.getAccountCount()).toBe(2);
  });

  test('Newly opened account id appears in the accounts list', async () => {
    const openAccountPage = await accountPage.sidebar.goToOpenNewAccount();
    await openAccountPage.openNewAccount('SAVINGS');

    const newAccountId = await openAccountPage.getNewAccountId();
    const overviewPage = await openAccountPage.sidebar.goToAccountsOverview();

    const accountIds = await overviewPage.getAccountIds();
    expect(accountIds).toContain(newAccountId);
  });

  test('Logging out returns to the public login page', async () => {
    const loginPage = await accountPage.sidebar.logout(); // chained: SidebarComponent -> LoginPage
    await expect(loginPage.loginButton).toBeVisible();
  });
});
