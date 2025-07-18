import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

// Create: lib/wagmi.ts

export const config = getDefaultConfig({
  appName: 'RootRise - Agricultural Crowdfunding',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'cd9b2e9c8b5a4f2e8d1c3a6b7e9f2d4a', // Default project ID for testing
  chains: [sepolia, ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [] : [mainnet])],
  ssr: true,
});