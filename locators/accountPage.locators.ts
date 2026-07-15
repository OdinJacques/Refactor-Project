import type { LocatorObj } from '../types';

export const accountPageLocators: LocatorObj = {
  accountTable: '#accountTable',
  accountRows: '#accountTable tbody tr',
  accountIdLinks: '#accountTable tbody tr td:first-child a',
  newAccountTypeSelect: '#type',
  newAccountFromSelect: '#fromAccountId',
  openAccountButton: 'input[value="Open New Account"]',
  openAccountResult: '#openAccountResult',
  newAccountIdLink: '#newAccountId',
};
