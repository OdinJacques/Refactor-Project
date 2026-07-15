import type { LocatorObj } from '../types';

export const registrationPageLocators: LocatorObj = {
  firstNameInput: '#customer\\.firstName',
  lastNameInput: '#customer\\.lastName',
  streetInput: '#customer\\.address\\.street',
  cityInput: '#customer\\.address\\.city',
  stateInput: '#customer\\.address\\.state',
  zipCodeInput: '#customer\\.address\\.zipCode',
  phoneNumberInput: '#customer\\.phoneNumber',
  ssnInput: '#customer\\.ssn',
  usernameInput: '#customer\\.username',
  passwordInput: '#customer\\.password',
  repeatPasswordInput: '#repeatedPassword',
  registerButton: 'input[value="Register"]',
  successMessage: '#rightPanel p',
  errorMessage: '.error',
};
