"use client";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits } from "ethers";
import { useEffect, useState } from "react";
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
  Progress,
  useToast,
  Icon,
} from '@chakra-ui/react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ethBalance } = useBalance({ address });
  const toast = useToast();
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Wrap contract hook calls in try-catch
  let contractHooks;
  try {
    contractHooks = useRootRiseContract();
  } catch (error) {
    console.error('Contract hooks error:', error);
    setHasError(true);
  }

  const { 
    useUSDCBalance, 
    useUSDCAllowance,
    useFaucet, 
    useApproveUSDC,
    formatUSDC, 
    ROOTRISE_ADDRESS 
  } = contractHooks || {};
  
  // Safe contract calls with fallbacks
  const { data: usdcBalance } = useUSDCBalance?.(address || '') || { data: null };
  const { data: usdcAllowance } = useUSDCAllowance?.(address || '', ROOTRISE_ADDRESS || '') || { data: null };
  const { claimFromFaucet, isLoading: isFaucetLoading } = useFaucet?.() || { claimFromFaucet: null, isLoading: false };
  const { approveUSDC, isLoading: isApproveLoading } = useApproveUSDC?.() || { approveUSDC: null, isLoading: false };

  // Check user readiness with error handling
  useEffect(() => {
    try {
      if (!isConnected || !usdcBalance || !usdcAllowance) {
        setIsReady(false);
        setSetupStep(0);
        return;
      }

      const hasUSDC = usdcBalance > BigInt(0);
      const hasApproval = usdcAllowance >= BigInt(1000000); // 1 USDC minimum

      if (!hasUSDC) {
        setSetupStep(1); // Need USDC
        setIsReady(false);
      } else if (!hasApproval) {
        setSetupStep(2); // Need approval
        setIsReady(false);
      } else {
        setSetupStep(3); // All set!
        setIsReady(true);
      }
    } catch (error) {
      console.error('Wallet setup error:', error);
      setHasError(true);
    }
  }, [isConnected, usdcBalance, usdcAllowance]);

  const handleGetUSDC = async () => {
    if (!claimFromFaucet) {
      toast({
        title: 'Error',
        description: 'Faucet not available. Please refresh the page.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await claimFromFaucet(1000);
      toast({
        title: 'Success!',
        description: 'Claimed 1000 test USDC',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Faucet error:', error);
      toast({
        title: 'Error',
        description: 'Failed to claim USDC. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleApproveUSDC = async () => {
    if (!approveUSDC) {
      toast({
        title: 'Error',
        description: 'Approval not available. Please refresh the page.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await approveUSDC('999999'); // Approve large amount
      toast({
        title: 'Success!',
        description: 'USDC spending approved',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve USDC. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Error fallback UI
  if (hasError) {
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
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <AlertTitle>Connection Issue</AlertTitle>
              <AlertDescription>
                There was an issue connecting to the blockchain. Please refresh the page and try again.
              </AlertDescription>
            </Box>
          </Alert>
          <Button onClick={() => window.location.reload()} size="sm" colorScheme="brand">
            Refresh Page
          </Button>
        </VStack>
      </Box>
    );
  }

  // Not connected state
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

  const isSepoliaNetwork = chainId === 11155111;

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
              {isReady && (
                <Badge colorScheme="green">Ready to Contribute</Badge>
              )}
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

        {/* Setup Progress */}
        {isSepoliaNetwork && (
          <Box w="full" p={4} bg={isReady ? "green.50" : "orange.50"} borderRadius="md">
            <VStack spacing={3}>
              <HStack justify="center" spacing={2}>
                <Icon 
                  as={isReady ? CheckIcon : WarningIcon} 
                  color={isReady ? "green.500" : "orange.500"} 
                />
                <Text fontWeight="bold" color={isReady ? "green.700" : "orange.700"}>
                  {isReady ? "You're Ready!" : "Setup Required"}
                </Text>
              </HStack>

              <Progress 
                value={(setupStep / 3) * 100} 
                colorScheme={isReady ? "green" : "orange"}
                size="sm"
                w="full"
                borderRadius="full"
              />

              <Text fontSize="xs" color="gray.600" textAlign="center">
                {setupStep === 0 && "Checking your setup..."}
                {setupStep === 1 && "Step 1: Get test USDC tokens"}
                {setupStep === 2 && "Step 2: Approve USDC spending"}
                {setupStep === 3 && "All set! You can now contribute to projects"}
              </Text>
            </VStack>
          </Box>
        )}

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
          <Flex justify="space-between" w="full" align="center">
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600">
                Test USDC:
              </Text>
              {setupStep >= 1 && (
                <Icon 
                  as={CheckIcon} 
                  color={usdcBalance && usdcBalance > BigInt(0) ? "green.500" : "gray.400"} 
                  w={3} h={3} 
                />
              )}
            </HStack>
            <Text fontSize="sm" fontWeight="bold">
              {usdcBalance && formatUSDC ? formatUSDC(usdcBalance) : '0'} USDC
            </Text>
          </Flex>

          {/* Approval Status */}
          <Flex justify="space-between" w="full" align="center">
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600">
                USDC Approved:
              </Text>
              {setupStep >= 2 && (
                <Icon 
                  as={CheckIcon} 
                  color={usdcAllowance && usdcAllowance >= BigInt(1000000) ? "green.500" : "gray.400"} 
                  w={3} h={3} 
                />
              )}
            </HStack>
            <Text fontSize="sm" fontWeight="bold">
              {usdcAllowance && formatUSDC ? formatUSDC(usdcAllowance) : '0'} USDC
            </Text>
          </Flex>
        </VStack>

        <Divider />

        {/* Action Buttons */}
        <VStack spacing={3} w="full">
          {setupStep === 1 && (
            <VStack spacing={2} w="full">
              <Text fontSize="sm" fontWeight="bold" color="orange.600">
                Step 1: Get Test USDC
              </Text>
              <Button
                size="sm"
                colorScheme="brand"
                onClick={handleGetUSDC}
                isLoading={isFaucetLoading}
                loadingText="Claiming..."
                w="full"
                isDisabled={!isSepoliaNetwork}
              >
                Get 1,000 Test USDC
              </Button>
            </VStack>
          )}

          {setupStep === 2 && (
            <VStack spacing={2} w="full">
              <Text fontSize="sm" fontWeight="bold" color="orange.600">
                Step 2: Approve USDC Spending
              </Text>
              <Button
                size="sm"
                colorScheme="orange"
                onClick={handleApproveUSDC}
                isLoading={isApproveLoading}
                loadingText="Approving..."
                w="full"
                isDisabled={!isSepoliaNetwork}
              >
                Approve USDC for Contributions
              </Button>
            </VStack>
          )}

          {setupStep === 3 && (
            <VStack spacing={2} w="full">
              <Text fontSize="sm" fontWeight="bold" color="green.600">
                🎉 You're All Set!
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                You can now contribute to any project on RootRise
              </Text>
            </VStack>
          )}

          {/* Additional Faucet Button (always available) */}
          {setupStep !== 1 && (
            <Button
              size="xs"
              colorScheme="gray"
              variant="outline"
              onClick={handleGetUSDC}
              isLoading={isFaucetLoading}
              loadingText="Claiming..."
              w="full"
              isDisabled={!isSepoliaNetwork}
            >
              Get More Test USDC
            </Button>
          )}
          
          <Text fontSize="xs" color="gray.500" textAlign="center">
            Use the faucet to get test USDC for contributing to projects
          </Text>
        </VStack>

        {/* Disconnect */}
        <Divider />
        <ConnectButton />
      </VStack>
    </Box>
  );
}

// Simplified button component for navigation
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