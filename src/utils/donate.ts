export type DonationFrequency = 'once' | 'monthly';

export interface DonationConfig {
  amounts: number[];
  allowRecurring: boolean;
  currency: 'usd';
  minAmount: number;
  maxAmount: number;
}

export const donationConfig: DonationConfig = {
  amounts: [25, 50, 100, 250, 500],
  allowRecurring: true,
  currency: 'usd',
  minAmount: 5,
  maxAmount: 100_000,
};

export interface CreateCheckoutPayload {
  amount: number;
  frequency: DonationFrequency;
}

export interface CreateCheckoutResponse {
  ok: boolean;
  url?: string;
  error?: string;
}
