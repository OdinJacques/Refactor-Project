import { test, expect } from '@playwright/test';

test.describe('Accounts Overview', () => {
  test.beforeEach(async ({ page }) => {
    const username = `qa_user_${Date.now()}`;

    // Registration duplicated a third time to reach a logged-in state.
    await page.goto('/parabank/register.htm');
    await page.locator('#customer\\.firstName').fill('Jane');
    await page.locator('#customer\\.lastName').fill('Doe');
    await page.locator('#customer\\.address\\.street').fill('123 Main St');
    await page.locator('#customer\\.address\\.city').fill('Springfield');
    await page.locator('#customer\\.address\\.state').fill('IL');
    await page.locator('#customer\\.address\\.zipCode').fill('62704');
    await page.locator('#customer\\.phoneNumber').fill('5551234567');
    await page.locator('#customer\\.ssn').fill('123-45-6789');
    await page.locator('#customer\\.username').fill(username);
    await page.locator('#customer\\.password').fill('Password123!');
    await page.locator('#repeatedPassword').fill('Password123!');
    await page.locator('input[value="Register"]').click();
  });

  test('overview lists exactly one checking account after registration', async ({ page }) => {
    await expect(page.locator('#accountTable tbody tr')).toHaveCount(1);
  });

  test('sidebar menu exposes all account actions', async ({ page }) => {
    // Sidebar locators duplicated here, and again in transfer-funds.spec.ts.
    await expect(page.locator('#leftPanel')).toContainText('Accounts Overview');
    await expect(page.locator('#leftPanel')).toContainText('Open New Account');
    await expect(page.locator('#leftPanel')).toContainText('Transfer Funds');
    await expect(page.locator('#leftPanel')).toContainText('Bill Pay');
    await expect(page.locator('#leftPanel')).toContainText('Log Out');
  });

  test('opening a new savings account adds it to the overview', async ({ page }) => {
    await page.locator('#leftPanel a[href="openaccount.htm"]').click();
    await page.locator('#type').selectOption('1'); // SAVINGS
    await page.locator('input[value="Open New Account"]').click();

    await expect(page.locator('#openAccountResult')).toContainText('Congratulations');

    await page.locator('#leftPanel a[href="overview.htm"]').click();
    await expect(page.locator('#accountTable tbody tr')).toHaveCount(2);
  });

  test('logging out returns to the public login page', async ({ page }) => {
    await page.locator('#leftPanel a[href="logout.htm"]').click();

    await expect(page.locator('input[value="Log In"]')).toBeVisible();
  });
});
