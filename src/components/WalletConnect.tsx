"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits } from "ethers";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useRootRiseContract } from "@/hooks/useRootRiseContract";

import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Flex,
  Avatar,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId(); // Updated hook
  const { data: ethBalance } = useBalance({ address });
  const { useUSDCBalance, useFaucet, formatUSDC } = useRootRiseContract();
  const { data: usdcBalance } = useUSDCBalance(address || '');
  const { claimFromFaucet, isLoading: isFaucetLoading } = useFaucet();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!isConnected) {
    return (
      <Box
        p={6}
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="xl"
        maxW="md"
        mx="auto"
      >
        <VStack spacing={4}>
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Connect Your Wallet
          </Text>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Connect your MetaMask wallet to interact with RootRise platform
          </Text>
          <ConnectButton />
        </VStack>
      </Box>
    );
  }

  const isSepoliaNetwork = chainId === 11155111; // Use chainId directly

  return (
    <Box
      p={6}
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      maxW="md"
      mx="auto"
    >
      <VStack spacing={4}>
        {/* Wallet Status */}
        <HStack spacing={3} w="full">
          <Avatar size="sm" bg="brand.500" />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="bold">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Text>
            <HStack>
              <Badge colorScheme="green">Connected</Badge>
              <Badge colorScheme={isSepoliaNetwork ? 'blue' : 'red'}>
                {isSepoliaNetwork ? 'Sepolia' : 'Wrong Network'}
              </Badge>
            </HStack>
          </VStack>
        </HStack>

        {/* Network Warning */}
        {!isSepoliaNetwork && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Wrong Network!</AlertTitle>
              <AlertDescription fontSize="xs">
                Please switch to Sepolia testnet to use RootRise.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Divider />

        {/* Balances */}
        <VStack spacing={3} w="full">
          <Text fontSize="md" fontWeight="bold">
            Wallet Balances
          </Text>
          
          {/* ETH Balance */}
          <Flex justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              Sepolia ETH:
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              {ethBalance ? parseFloat(formatUnits(ethBalance.value, 18)).toFixed(4) : '0.0000'} ETH
            </Text>
          </Flex>

          {/* USDC Balance */}
          <Flex justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              Test USDC:
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              {usdcBalance ? formatUSDC(usdcBalance) : '0'} USDC
            </Text>
          </Flex>
        </VStack>

        <Divider />

        {/* Faucet Section */}
        <VStack spacing={3} w="full">
          <Text fontSize="sm" fontWeight="bold">
            Need Test Tokens?
          </Text>
          
          <Button
            size="sm"
            colorScheme="brand"
            variant="outline"
            onClick={() => claimFromFaucet(1000)}
            isLoading={isFaucetLoading}
            loadingText="Claiming..."
            w="full"
            isDisabled={!isSepoliaNetwork}
          >
            Get 1,000 Test USDC
          </Button>
          
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Use the faucet to get test USDC for contributing to projects
          </Text>
        </VStack>

        {/* Disconnect */}
        <ConnectButton />
      </VStack>
    </Box>
  );
}

// Simplified version for header/navbar
export function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} colorScheme="brand">
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} colorScheme="red">
                    Wrong network
                  </Button>
                );
              }

              return (
                <HStack spacing={2}>
                  <Button
                    onClick={openChainModal}
                    size="sm"
                    variant="outline"
                  >
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} size="sm">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </Button>
                </HStack>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}