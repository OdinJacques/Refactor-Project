import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { RegistrationPage } from '../pages/registrationPage';
import { buildRegistrationDetails } from './utils/registrationData';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login elements are displayed', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Unknown username shows a credentials-mismatch error', async () => {
    await loginPage.attemptLogin('not_a_real_user', 'wrong_password');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('could not be verified');
  });

  test('Blank credentials show a login error', async () => {
    await loginPage.attemptLogin('', '');

    const error = await loginPage.getErrorMessage();
    expect(error.length).toBeGreaterThan(0);
  });
});

test.describe('Login with a registered customer', () => {
  test('Registered customer can log out then log back in', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);
    const details = buildRegistrationDetails();

    await registrationPage.goto();
    const accountPage = await registrationPage.register(details); // chained: RegistrationPage -> AccountPage

    await accountPage.logout(); // not chained yet — see SidebarComponent commit
    await loginPage.goto();
    const overviewPage = await loginPage.login(details.username, details.password); // chained: LoginPage -> AccountPage

    await expect(page).toHaveURL(/overview\.htm/);
    const sidebarText = await overviewPage.getSidebarText();
    expect(sidebarText).toContain('Accounts Overview');
  });

  test('Cannot access accounts overview after logging out', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const details = buildRegistrationDetails();

    await registrationPage.goto();
    const accountPage = await registrationPage.register(details);
    await accountPage.logout();

    await page.goto('https://parabank.parasoft.com/parabank/overview.htm');
    await expect(page.locator('input[value="Log In"]')).toBeVisible();
  });
});
