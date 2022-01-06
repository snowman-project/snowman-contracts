export interface NamedAddress {
  name: string;
  address: string;
}

export interface TokenConfig extends NamedAddress {
  symbol: string;
  mock: {
    richHolder: { address: string };
  };
}

export interface GlobalConfig {
  testers: Record<'me', NamedAddress>;
  tokens: Record<'usdc', TokenConfig>;
}

const config: GlobalConfig = {
  testers: {
    me: {
      name: 'Henry',
      address: '0x523656820AbB0A5e70bd40A5378f9cFD86d3E17e',
    },
  },
  tokens: {
    usdc: {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      mock: {
        richHolder: { address: '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3' },
      },
    },
    // dai: {
    //   name: 'DAI',
    //   symbol: 'DAI',
    //   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    //   mock: {
    //     richHolder: { address: '0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8' },
    //   },
    // },
    // usdt: {
    //   name: 'Tether USD',
    //   symbol: 'USDT',
    //   address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    //   mock: {
    //     richHolder: { address: '0x5754284f345afc66a98fbb0a0afe71e0f007b949' },
    //   },
    // },
  },
};

export default config;
