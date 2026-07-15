import { test, expect } from '@playwright/test';

test.describe('Transfer Funds', () => {
  test.beforeEach(async ({ page }) => {
    const username = `qa_user_${Date.now()}`;

    // Registration duplicated a fourth time.
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

    // Open a second account so there's somewhere to transfer to.
    await page.locator('#leftPanel a[href="openaccount.htm"]').click();
    await page.locator('#type').selectOption('1');
    await page.locator('input[value="Open New Account"]').click();
    await page.locator('#leftPanel a[href="overview.htm"]').click();
  });

  test('transferring funds between own accounts shows a confirmation', async ({ page }) => {
    await page.locator('#leftPanel a[href="transfer.htm"]').click();

    await page.locator('#amount').fill('100');
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.locator('#toAccountId').selectOption({ index: 1 });
    await page.locator('input[value="Transfer"]').click();

    await expect(page.locator('#showResult h1')).toContainText('Transfer Complete!');
  });

  test('sidebar remains available on the transfer confirmation page', async ({ page }) => {
    await page.locator('#leftPanel a[href="transfer.htm"]').click();

    await page.locator('#amount').fill('50');
    await page.locator('#fromAccountId').selectOption({ index: 0 });
    await page.locator('#toAccountId').selectOption({ index: 1 });
    await page.locator('input[value="Transfer"]').click();

    // Sidebar locators duplicated yet again.
    await expect(page.locator('#leftPanel')).toContainText('Transfer Funds');
    await expect(page.locator('#leftPanel')).toContainText('Log Out');
  });
});
