import { NamedAddress } from './NamedAddress';

export type ERC20Symbol = 'USDC' | 'WETH';

export interface ERC20Token extends NamedAddress {
  symbol: ERC20Symbol;
  decimals: number;
}

export const SUPPORTED_ERC20_TOKENS: Record<ERC20Symbol, ERC20Token> = {
  USDC: {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  WETH: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
  },
};
