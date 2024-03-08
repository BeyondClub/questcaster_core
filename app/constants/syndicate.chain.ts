import { type Chain } from "viem";

export const syndicateChain = {
  id: 5101,
  name: "Syndicate Frame Chain",
  iconUrl: "https://questcaster.xyz/images/syndicate.png",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc-frame.syndicate.io"] },
    default: { http: ["https://rpc-frame.syndicate.io"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Frame Explorer",
      url: "https://explorer-frame.syndicate.io",
    },
    default: {
      name: "Frame Explorer",
      url: "https://explorer-frame.syndicate.io",
    },
  },
} as const satisfies Chain & { iconUrl?: string };
