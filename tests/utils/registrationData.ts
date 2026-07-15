import type { RegistrationDetails } from '../../types';

export function buildRegistrationDetails(
  overrides: Partial<RegistrationDetails> = {}
): RegistrationDetails {
  const unique = Date.now();
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    phoneNumber: '5551234567',
    ssn: '123-45-6789',
    username: `qa_user_${unique}`,
    password: 'Password123!',
    ...overrides,
  };
}
