import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';
import { buildRegistrationDetails } from './utils/registrationData';

test.describe('Registration', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
  });

  test('Registration form fields are displayed', async () => {
    await expect(registrationPage.firstNameInput).toBeVisible();
    await expect(registrationPage.lastNameInput).toBeVisible();
    await expect(registrationPage.usernameInput).toBeVisible();
    await expect(registrationPage.passwordInput).toBeVisible();
    await expect(registrationPage.registerButton).toBeVisible();
  });

  test('New customer can register and is logged in automatically', async ({ page }) => {
    const details = buildRegistrationDetails();
    const accountPage = await registrationPage.register(details);

    await expect(page).toHaveURL(/overview\.htm/);
    const message = await registrationPage.getSuccessMessage();
    expect(message).toContain('Your account was created successfully');
    expect(await accountPage.getAccountCount()).toBe(1);
  });

  test('Mismatched passwords show a validation error', async () => {
    const details = buildRegistrationDetails();
    await registrationPage.fillRegistrationForm({
      ...details,
      repeatPassword: 'SomethingElse!',
    });
    await registrationPage.submitRegistration();

    const error = await registrationPage.getErrorMessage();
    expect(error).toContain('Passwords did not match');
  });

  test('Blank username shows a required-field error', async () => {
    const details = buildRegistrationDetails({ username: '' });
    await registrationPage.fillRegistrationForm(details);
    await registrationPage.submitRegistration();

    const error = await registrationPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('Blank last name shows a required-field error', async () => {
    const details = buildRegistrationDetails({ lastName: '' });
    await registrationPage.fillRegistrationForm(details);
    await registrationPage.submitRegistration();

    const error = await registrationPage.getErrorMessage();
    expect(error).toContain('Last name is required');
  });
});
