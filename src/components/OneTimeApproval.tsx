"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useRootRiseContract } from "@/hooks/useRootRiseContract";

import {
  Box,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";

export function OneTimeApproval() {
  const { address } = useAccount();
  const toast = useToast();
  const [step, setStep] = useState(1);

  const {
    useUSDCBalance,
    useUSDCAllowance,
    useApproveUSDC,
    formatUSDC,
    ROOTRISE_ADDRESS,
  } = useRootRiseContract();

  const { data: usdcBalance } = useUSDCBalance(address || "");
  const { data: allowance } = useUSDCAllowance(address || "", ROOTRISE_ADDRESS);
  const { approveUSDC, isLoading: isApproving } = useApproveUSDC();

  const isApproved = allowance && parseFloat(formatUSDC(allowance)) >= 1000;

  const handleApproveMax = async () => {
    try {
      setStep(2);
      // Approve a large amount (999999 USDC) so you never need to approve again
      const hash = await approveUSDC("999999");
      
      if (hash) {
        setStep(3);
        toast({
          title: "SUCCESS! ✅",
          description: "You're approved! Now you can contribute to any project without approving again.",
          status: "success",
          duration: 10000,
        });
      }
    } catch (error) {
      setStep(1);
      toast({
        title: "Approval Failed",
        description: "Please try again",
        status: "error",
        duration: 5000,
      });
    }
  };

  if (isApproved) {
    return (
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">✅ You're Already Approved!</Text>
          <Text fontSize="sm">
            Current allowance: {formatUSDC(allowance || 0n)} USDC
          </Text>
          <Text fontSize="sm">
            You can now contribute to any project without additional approvals.
          </Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <Box p={6} border="2px" borderColor="orange.300" borderRadius="lg" bg="orange.50">
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold" color="orange.800">
          🔐 One-Time Approval Required
        </Text>
        
        <Text fontSize="sm" textAlign="center" color="gray.700">
          You need to approve the RootRise contract to spend your USDC tokens.
          This is a one-time setup - after this, you can contribute to any project instantly!
        </Text>

        <VStack spacing={2}>
          <Text fontSize="sm">
            Your USDC Balance: {usdcBalance ? formatUSDC(usdcBalance) : "Loading..."} USDC
          </Text>
          <Text fontSize="sm">
            Current Allowance: {allowance ? formatUSDC(allowance) : "0"} USDC
          </Text>
        </VStack>

        {step === 1 && (
          <Button
            colorScheme="orange"
            size="lg"
            onClick={handleApproveMax}
            w="full"
          >
            🚀 Approve USDC Spending (One-Time Setup)
          </Button>
        )}

        {step === 2 && (
          <VStack spacing={2}>
            <Button
              colorScheme="orange"
              size="lg"
              isLoading={true}
              loadingText="Approving..."
              w="full"
            />
            <Text fontSize="sm" color="gray.600">
              Confirm the transaction in MetaMask...
            </Text>
          </VStack>
        )}

        {step === 3 && (
          <Alert status="success">
            <AlertIcon />
            <Text fontSize="sm">
              ✅ Approved! You can now contribute to projects instantly.
            </Text>
          </Alert>
        )}

        <Box bg="white" p={3} borderRadius="md" w="full">
          <Text fontSize="xs" color="gray.600">
            <strong>What this does:</strong> Allows the RootRise contract to transfer USDC from your wallet when you contribute to projects. This is standard for all DeFi applications and is completely safe.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}