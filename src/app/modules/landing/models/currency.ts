export enum Currency {
  CAD = 'cad',
  USD = 'usd',
  ETH = 'eth',
  BTC = 'btc',
  RMB = 'rmb',
  NA = 'na'
}

export const Symbols = {
  [Currency.CAD]: 'CAD $',
  [Currency.USD]: 'USD $',
  [Currency.RMB]: 'RMB ¥',
  [Currency.ETH]: 'ETH Ξ',
  [Currency.BTC]: 'BTC ₿'
};
