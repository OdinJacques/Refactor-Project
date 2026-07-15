import type { LocatorObj } from '../types';

export const loginPageLocators: LocatorObj = {
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'input[value="Log In"]',
  errorMessage: '#rightPanel p.error',
};
