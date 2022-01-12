import {
  ERC20Symbol,
  NamedAddress,
  ERC20Token,
  SUPPORTED_ERC20_TOKENS,
} from './types';

export interface TokenConfig extends ERC20Token {
  mock: {
    richHolder: { address: string };
  };
}

export interface GlobalConfig {
  testers: Record<'me', NamedAddress>;
  tokens: Record<ERC20Symbol, TokenConfig>;
}

const config: GlobalConfig = {
  testers: {
    me: {
      name: 'Henry',
      address: '0x523656820AbB0A5e70bd40A5378f9cFD86d3E17e',
    },
  },
  tokens: {
    USDC: {
      ...SUPPORTED_ERC20_TOKENS.USDC,
      mock: {
        richHolder: { address: '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3' },
      },
    },
    WETH: {
      ...SUPPORTED_ERC20_TOKENS.WETH,
      mock: {
        richHolder: { address: '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3' },
      },
    },
  },
};

export default config;
