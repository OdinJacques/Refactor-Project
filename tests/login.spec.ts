import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('invalid credentials show an error on the public login page', async ({ page }) => {
    await page.goto('/parabank/index.htm');
    await page.locator('input[name="username"]').fill('not_a_real_user');
    await page.locator('input[name="password"]').fill('wrong_password');
    await page.locator('input[value="Log In"]').click();

    await expect(page.locator('#rightPanel p.error')).toContainText('could not be verified');
  });

  test('registered customer can log out then log back in', async ({ page }) => {
    const username = `qa_user_${Date.now()}`;
    const password = 'Password123!';

    // Registration duplicated here again just to get a valid account to log in with.
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
    await page.locator('#customer\\.password').fill(password);
    await page.locator('#repeatedPassword').fill(password);
    await page.locator('input[value="Register"]').click();

    // Log out, then exercise the login form explicitly.
    await page.locator('#leftPanel a[href="logout.htm"]').click();
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[value="Log In"]').click();

    await expect(page).toHaveURL(/overview\.htm/);
    await expect(page.locator('#leftPanel')).toContainText('Accounts Overview');
  });
});
