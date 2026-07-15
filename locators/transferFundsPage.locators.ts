import type { LocatorObj } from '../types';

export const transferFundsPageLocators: LocatorObj = {
  amountInput: '#amount',
  fromAccountSelect: '#fromAccountId',
  toAccountSelect: '#toAccountId',
  transferButton: 'input[value="Transfer"]',
  resultHeading: '#showResult h1',
  resultAmount: '#showResult #amount',
  resultFromAccount: '#showResult #fromAccountId',
  resultToAccount: '#showResult #toAccountId',
};
