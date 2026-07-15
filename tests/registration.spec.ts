import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('new customer can register and is logged in automatically', async ({ page }) => {
    const username = `qa_user_${Date.now()}`;

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

    await expect(page.locator('#rightPanel p')).toContainText(
      'Your account was created successfully'
    );
    await expect(page).toHaveURL(/overview\.htm/);
  });

  test('registration fails when the two password fields do not match', async ({ page }) => {
    const username = `qa_user_${Date.now()}`;

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
    await page.locator('#repeatedPassword').fill('SomethingElse!');
    await page.locator('input[value="Register"]').click();

    await expect(page.locator('.error')).toContainText('Passwords did not match');
  });

  test('registration fails when username is left blank', async ({ page }) => {
    await page.goto('/parabank/register.htm');
    await page.locator('#customer\\.firstName').fill('Jane');
    await page.locator('#customer\\.lastName').fill('Doe');
    await page.locator('#customer\\.address\\.street').fill('123 Main St');
    await page.locator('#customer\\.address\\.city').fill('Springfield');
    await page.locator('#customer\\.address\\.state').fill('IL');
    await page.locator('#customer\\.address\\.zipCode').fill('62704');
    await page.locator('#customer\\.phoneNumber').fill('5551234567');
    await page.locator('#customer\\.ssn').fill('123-45-6789');
    await page.locator('#customer\\.password').fill('Password123!');
    await page.locator('#repeatedPassword').fill('Password123!');
    await page.locator('input[value="Register"]').click();

    await expect(page.locator('.error')).toContainText('Username is required');
  });
});
