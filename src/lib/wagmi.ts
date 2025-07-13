import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

// import { configureChains, createConfig } from "wagmi";
// import { publicProvider } from "wagmi/providers/public";

// TODO: Add these back later for better performance and redundancy
// import { mainnet } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { infuraProvider } from "wagmi/providers/infura";

// Configure chains for the application (simplified)
// export const { chains, publicClient, webSocketPublicClient } = configureChains(
  // [
    // sepolia, 
    // TODO: Add mainnet later for production
    // ...(process.env.NODE_ENV === 'production' ? [mainnet] : []),
  // ],
  // [
    // Using only public provider for simplicity
    // publicProvider(),
    
    // TODO: Add these back later for better performance
    // alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo' }),
    // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || 'demo' }),
  // ]
// );

// Configure wallet connectors
// const { connectors } = getDefaultWallets({
//   appName: 'RootRise - Agricultural Crowdfunding',
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
//   chains,
// });

// Create wagmi configuration
// export const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
//   webSocketPublicClient,
// });

// Smart contract addresses (update these with your deployed contracts)
export const CONTRACTS = {
  ROOTRISE: process.env.NEXT_PUBLIC_ROOTRISE_CONTRACT || '0x...',
  MOCK_USDC: process.env.NEXT_PUBLIC_MOCK_USDC_CONTRACT || '0x...',
} as const;

// Network configuration (simplified)
export const SUPPORTED_CHAINS = {
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    explorer: 'https://sepolia.etherscan.io',
    rpc: 'https://sepolia.infura.io/v3/',
  },
  // TODO: Add mainnet configuration later
  // [mainnet.id]: {
  //   name: 'Ethereum Mainnet',
  //   explorer: 'https://etherscan.io',
  //   rpc: 'https://mainnet.infura.io/v3/',
  // },
};

// Helper function to get contract address for current chain
export const getContractAddress = (contractName: keyof typeof CONTRACTS, chainId?: number) => {
  // In a production app, you'd have different addresses for different chains
  return CONTRACTS[contractName];
};

// Chain-specific configuration
export const getChainConfig = (chainId: number) => {
  return SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
};

// Default chain for the application
export const DEFAULT_CHAIN = sepolia;

/* 
TODO: Future Enhancements (uncomment when ready):

1. Multiple Providers for Better Performance:
   - Alchemy: Fast, reliable RPC
   - Infura: Backup RPC provider
   - Custom RPC: Your own node

2. Mainnet Support:
   - Add mainnet configuration
   - Environment-based chain selection
   - Production deployment settings

3. Advanced Features:
   - Custom wallet connectors
   - Chain switching logic
   - Error handling and retries
   - Rate limiting and caching

To enable these features later:
1. Uncomment the imports at the top
2. Uncomment the provider configurations
3. Add your API keys to .env.local
4. Uncomment mainnet configuration
*/