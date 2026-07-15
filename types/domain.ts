export type AccountType = 'CHECKING' | 'SAVINGS';

export type RegistrationDetails = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
  repeatPassword?: string;
};

export type TransferFundsDetails = {
  amount: string;
  fromAccountIndex?: number;
  toAccountIndex?: number;
};
