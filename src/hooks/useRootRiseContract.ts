import { useToast } from "@chakra-ui/react";
import { formatUnits, parseUnits } from "ethers";
import { useState } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { sepolia } from "wagmi/chains";
import { MOCK_USDC_ABI } from "./mockUsdcAbi";
import { ROOTRISE_ABI } from "./rootriseAbi";

// Contract addresses from your .env
const ROOTRISE_ADDRESS = process.env.NEXT_PUBLIC_ROOTRISE_CONTRACT as `0x${string}`;
const MOCK_USDC_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDC_CONTRACT as `0x${string}`;

// Utility functions for USDC formatting (6 decimals for USDC)
const formatUSDCAmount = (amount: bigint) => formatUnits(amount, 6);
const parseUSDCAmount = (amount: string) => parseUnits(amount, 6);

export function useRootRiseContract() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  // Check if on correct network
  const isCorrectNetwork = chainId === sepolia.id;

  // Helper function to check prerequisites
  const checkPrerequisites = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        status: "warning",
        duration: 3000,
      });
      return false;
    }
    if (!isCorrectNetwork) {
      toast({
        title: "Wrong network",
        description: "Please switch to Sepolia testnet",
        status: "warning",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  // Read Functions - RootRise
  const useGetTotalProjects = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "getTotalProjects",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: bigint };

  const useGetProject = (projectId: number) =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "getProject",
      args: [BigInt(projectId)],
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: any }; // Adjust type based on Project struct

  const useGetContribution = (projectId: number, contributor: string) =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "getContribution",
      args: [BigInt(projectId), contributor as `0x${string}`],
      query: { enabled: isConnected && isCorrectNetwork && !!contributor },
    }) as { data?: bigint };

  const useIsFarmerApproved = (farmerAddress: string) =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "isFarmerApproved",
      args: [farmerAddress as `0x${string}`],
      query: { enabled: isConnected && isCorrectNetwork && !!farmerAddress },
    }) as { data?: boolean };

  const useGetFarmerApplication = (farmerAddress: string) =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "farmerApplications",
      args: [farmerAddress as `0x${string}`],
      query: { enabled: isConnected && isCorrectNetwork && !!farmerAddress },
    }) as { data?: any }; // Adjust type based on FarmerApplication struct

  const useGetContractBalance = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "getContractBalance",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: bigint };

  const useGetProjectContributors = (projectId: number) =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "getProjectContributors",
      args: [BigInt(projectId)],
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: string[] };

  const useGetMinimumContribution = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "MINIMUM_CONTRIBUTION",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: bigint };

  const useGetMaximumDuration = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "MAXIMUM_DURATION",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: bigint };

  const useGetOwner = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "owner",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: `0x${string}` };

  const useGetStablecoinAddress = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "stablecoin",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: `0x${string}` };

  const useGetProjectCounter = () =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "projectCounter",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: bigint };

  const useGetTotalContributions = (userAddress: string) =>
    useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: "totalContributions",
      args: [userAddress as `0x${string}`],
      query: { enabled: isConnected && isCorrectNetwork && !!userAddress },
    }) as { data?: bigint };

  // Read Functions - USDC
  const useUSDCBalance = (address: string) =>
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
      query: { enabled: isConnected && isCorrectNetwork && !!address },
    }) as { data?: bigint };

  const useUSDCAllowance = (owner: string, spender: string) =>
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "allowance",
      args: [owner as `0x${string}`, spender as `0x${string}`],
      query: { enabled: isConnected && isCorrectNetwork && !!owner && !!spender },
    }) as { data?: bigint };

  const useUSDCName = () =>
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "name",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: string };

  const useUSDCSymbol = () =>
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "symbol",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: string };

  const useUSDCDecimals = () =>
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "decimals",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: number };

  const useUSDCTotalSupply = () =>
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: "totalSupply",
      query: { enabled: isConnected && isCorrectNetwork },
    }) as { data?: bigint };

  // Write Functions
  const { writeContract } = useWriteContract();

  const useSubmitFarmerApplication = () => {
    const submitApplication = async (documentsHash: string, mobileMoneyAccount: string) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "submitFarmerApplication",
          args: [documentsHash, mobileMoneyAccount],
        });
        toast({
          title: "Application Submitted",
          description: "Your farmer application is being processed",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Application error:", error);
        toast({
          title: "Application Error",
          description: error.message || "Failed to submit application",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { submitApplication, isLoading };
  };

  const useCreateProject = () => {
    const createProject = async (
      title: string,
      goalInUSDC: string,
      durationInDays: number,
      mobileMoneyAccount: string
    ) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const goalWei = parseUSDCAmount(goalInUSDC);
        if (!(await useIsFarmerApproved(address!).data)) {
          toast({
            title: "Not Approved",
            description: "You must be an approved farmer to create a project",
            status: "warning",
            duration: 5000,
          });
          return null;
        }

        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "submitProject",
          args: [title, goalWei, BigInt(durationInDays), mobileMoneyAccount],
        });
        toast({
          title: "Project Created",
          description: "Your project has been submitted for approval",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Create project error:", error);
        toast({
          title: "Project Creation Error",
          description: error.message || "Failed to create project",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { createProject, isLoading };
  };

  const useContribute = () => {
    const contribute = async (projectId: number, amountInUSDC: string) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const amountWei = parseUSDCAmount(amountInUSDC);

        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "contribute",
          args: [BigInt(projectId), amountWei],
          gas: 300000n,
        });
        toast({
          title: "Contributing...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Contribution error:", error);
        if (error.message?.includes("insufficient allowance")) {
          toast({
            title: "Approval Required",
            description: "Please approve USDC spending first",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        } else if (error.message?.includes("insufficient balance")) {
          toast({
            title: "Insufficient Balance",
            description: "You don't have enough USDC to contribute",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Contribution Error",
            description: error.message || "Failed to contribute",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { contribute, isLoading };
  };

  const useApproveUSDC = () => {
    const approveUSDC = async (amountInUSDC: string) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const amountWei = parseUSDCAmount(amountInUSDC);

        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: "approve",
          args: [ROOTRISE_ADDRESS, amountWei],
          gas: 80000n,
        });
        toast({
          title: "Approving USDC...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Approval error:", error);
        toast({
          title: "Approval Error",
          description: error.message || "Failed to approve USDC",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { approveUSDC, isLoading };
  };

  const useFaucet = () => {
    const claimFromFaucet = async (amountInUSDC: number = 1000) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const amountWei = parseUSDCAmount(amountInUSDC.toString());

        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: "faucet",
          args: [amountWei],
        });
        toast({
          title: "Claiming Tokens...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Faucet error:", error);
        toast({
          title: "Faucet Error",
          description: error.message || "Failed to claim tokens",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { claimFromFaucet, isLoading };
  };

  const useSubmitGovernmentApplication = () => {
    const submitGovernmentApplication = async (
      officialName: string,
      officialRole: string,
      documentsHash: string
    ) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "submitGovernmentApplication",
          args: [officialName, officialRole, documentsHash],
        });
        toast({
          title: "Application Submitted",
          description: "Your government application is being processed",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Government application error:", error);
        toast({
          title: "Application Error",
          description: error.message || "Failed to submit government application",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { submitGovernmentApplication, isLoading };
  };

  const useAddGovernmentOfficial = () => {
    const addGovernmentOfficial = async (officialAddress: `0x${string}`) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "addGovernmentOfficial",
          args: [officialAddress],
        });
        toast({
          title: "Adding Official...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Add government official error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to add government official",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { addGovernmentOfficial, isLoading };
  };

  const useAddFarmer = () => {
    const addFarmer = async (farmerAddress: `0x${string}`) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "approveFarmer",
          args: [farmerAddress],
        });
        toast({
          title: "Whitelisting Farmer...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Add farmer error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to whitelist farmer",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { addFarmer, isLoading };
  };

  const useApproveProject = () => {
    const approveProject = async (projectId: number) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "approveProject",
          args: [BigInt(projectId)],
          gas: 100000n, // Reasonable gas limit for approval
        });
        toast({
          title: "Approving Project...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Approve project error:", error);
        toast({
          title: "Approval Error",
          description: error.message || "Failed to approve project",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { approveProject, isLoading };
  };

  const useReleaseFunds = () => {
    const releaseFunds = async (projectId: number) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: "releaseFunds",
          args: [BigInt(projectId)],
          gas: 200000n, // Reasonable gas limit for fund release
        });
        toast({
          title: "Releasing Funds...",
          description: "Transaction submitted to blockchain",
          status: "info",
          duration: 3000,
        });
        return hash;
      } catch (error: any) {
        console.error("Release funds error:", error);
        toast({
          title: "Release Error",
          description: error.message || "Failed to release funds",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    return { releaseFunds, isLoading };
  };

  // Utility functions
  const formatUSDC = (amount: bigint) => formatUSDCAmount(amount);
  const parseUSDC = (amount: string) => parseUSDCAmount(amount);

  return {
    useGetTotalProjects,
    useGetProject,
    useGetContribution,
    useIsFarmerApproved,
    useGetFarmerApplication,
    useGetContractBalance,
    useGetProjectContributors,
    useGetMinimumContribution,
    useGetMaximumDuration,
    useGetOwner,
    useGetStablecoinAddress,
    useGetProjectCounter,
    useGetTotalContributions,
    useUSDCBalance,
    useUSDCAllowance,
    useUSDCName,
    useUSDCSymbol,
    useUSDCDecimals,
    useUSDCTotalSupply,
    useSubmitFarmerApplication,
    useCreateProject,
    useContribute,
    useApproveUSDC,
    useFaucet,
    useSubmitGovernmentApplication,
    useAddGovernmentOfficial,
    useAddFarmer,
    useApproveProject,
    useReleaseFunds,
    formatUSDC,
    parseUSDC,
    ROOTRISE_ADDRESS,
    MOCK_USDC_ADDRESS,
    isConnected,
    isCorrectNetwork,
    isLoading,
  };
}