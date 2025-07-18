import { useToast } from "@chakra-ui/react";
import { formatUnits, parseUnits } from "ethers";
import { useState } from "react";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { sepolia } from "wagmi/chains";
import { MOCK_USDC_ABI, ROOTRISE_ABI } from "@/types/contracts";

// Contract addresses from your .env
const ROOTRISE_ADDRESS = process.env.NEXT_PUBLIC_ROOTRISE_CONTRACT as `0x${string}`;
const MOCK_USDC_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDC_CONTRACT as `0x${string}`;

export function useRootRiseContract() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Check if on correct network
  const isCorrectNetwork = chainId === sepolia.id;

  // Helper function to check prerequisites
  const checkPrerequisites = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 3000,
      });
      return false;
    }
    
    if (!isCorrectNetwork) {
      toast({
        title: 'Wrong network',
        description: 'Please switch to Sepolia testnet',
        status: 'warning',
        duration: 3000,
      });
      return false;
    }
    
    return true;
  };

  // Read Functions
  const useGetTotalProjects = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'getTotalProjects',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetProject = (projectId: number) => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'getProject',
      args: [BigInt(projectId)],
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetContribution = (projectId: number, contributor: string) => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'getContribution',
      args: [BigInt(projectId), contributor as `0x${string}`],
      query: {
        enabled: isConnected && isCorrectNetwork && !!contributor,
      },
    });
  };

  const useIsFarmerWhitelisted = (farmerAddress: string) => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'isFarmerWhitelisted',
      args: [farmerAddress as `0x${string}`],
      query: {
        enabled: isConnected && isCorrectNetwork && !!farmerAddress,
      },
    });
  };

  const useGetContractBalance = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'getContractBalance',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  // Additional read functions from the real ABI
  const useGetProjectContributors = (projectId: number) => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'getProjectContributors',
      args: [BigInt(projectId)],
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetMinimumContribution = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'MINIMUM_CONTRIBUTION',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetMaximumDuration = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'MAXIMUM_DURATION',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetOwner = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'owner',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetStablecoinAddress = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'stablecoin',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetProjectCounter = () => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'projectCounter',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useGetTotalContributions = (userAddress: string) => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'totalContributions',
      args: [userAddress as `0x${string}`],
      query: {
        enabled: isConnected && isCorrectNetwork && !!userAddress,
      },
    });
  };

  const useIsWhitelistedFarmer = (farmerAddress: string) => {
    return useReadContract({
      address: ROOTRISE_ADDRESS,
      abi: ROOTRISE_ABI,
      functionName: 'whitelistedFarmers',
      args: [farmerAddress as `0x${string}`],
      query: {
        enabled: isConnected && isCorrectNetwork && !!farmerAddress,
      },
    });
  };

  // USDC Token Functions
  const useUSDCBalance = (address: string) => {
    return useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
      query: {
        enabled: isConnected && isCorrectNetwork && !!address,
      },
    });
  };

  const useUSDCAllowance = (owner: string, spender: string) => {
    return useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
      query: {
        enabled: isConnected && isCorrectNetwork && !!owner && !!spender,
      },
    });
  };

  const useUSDCName = () => {
    return useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'name',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useUSDCSymbol = () => {
    return useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'symbol',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useUSDCDecimals = () => {
    return useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'decimals',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  const useUSDCTotalSupply = () => {
    return useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: MOCK_USDC_ABI,
      functionName: 'totalSupply',
      query: {
        enabled: isConnected && isCorrectNetwork,
      },
    });
  };

  // Write Functions
  const { writeContract } = useWriteContract();

  const useAddFarmer = () => {
    const addFarmer = async (farmerAddress: string) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'addFarmer',
          args: [farmerAddress as `0x${string}`],
        });
        
        toast({
          title: 'Transaction Submitted',
          description: 'Whitelisting farmer...',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Add farmer error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to whitelist farmer',
          status: 'error',
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

  const useRemoveFarmer = () => {
    const removeFarmer = async (farmerAddress: string) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'removeFarmer',
          args: [farmerAddress as `0x${string}`],
        });
        
        toast({
          title: 'Transaction Submitted',
          description: 'Removing farmer from whitelist...',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Remove farmer error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to remove farmer',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { removeFarmer, isLoading };
  };

  const useCreateProject = () => {
    const createProject = async (
      farmerAddress: string,
      title: string,
      goalInUSDC: string,
      durationInDays: number
    ) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const goalWei = parseUnits(goalInUSDC, 6);
        
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'createProject',
          args: [
            farmerAddress as `0x${string}`,
            title,
            goalWei,
            BigInt(durationInDays)
          ],
        });
        
        toast({
          title: 'Creating Project...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Create project error:', error);
        toast({
          title: 'Project Creation Error',
          description: error.message || 'Failed to create project',
          status: 'error',
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
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        const amountWei = parseUnits(amountInUSDC, 6);
        
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'contribute',
          args: [BigInt(projectId), amountWei],
          gas: 150000n, // Set reasonable gas limit
        });
        
        toast({
          title: 'Contributing...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Contribution error:', error);
        toast({
          title: 'Contribution Error',
          description: error.message || 'Failed to contribute',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { contribute, isLoading };
  };

  const useDisburseFunds = () => {
    const disburseFunds = async (projectId: number) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'disburseFunds',
          args: [BigInt(projectId)],
        });
        
        toast({
          title: 'Disbursing Funds...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Disburse funds error:', error);
        toast({
          title: 'Disbursement Error',
          description: error.message || 'Failed to disburse funds',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { disburseFunds, isLoading };
  };

  const useClaimRefund = () => {
    const claimRefund = async (projectId: number) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'claimRefund',
          args: [BigInt(projectId)],
        });
        
        toast({
          title: 'Claiming Refund...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Claim refund error:', error);
        toast({
          title: 'Refund Error',
          description: error.message || 'Failed to claim refund',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { claimRefund, isLoading };
  };

  const useCloseFailedProject = () => {
    const closeFailedProject = async (projectId: number) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'closeFailedProject',
          args: [BigInt(projectId)],
        });
        
        toast({
          title: 'Closing Project...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Close project error:', error);
        toast({
          title: 'Close Project Error',
          description: error.message || 'Failed to close project',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { closeFailedProject, isLoading };
  };

  const useEmergencyWithdraw = () => {
    const emergencyWithdraw = async () => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        
        const hash = await writeContract({
          address: ROOTRISE_ADDRESS,
          abi: ROOTRISE_ABI,
          functionName: 'emergencyWithdraw',
        });
        
        toast({
          title: 'Emergency Withdrawal...',
          description: 'Transaction submitted to blockchain',
          status: 'warning',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Emergency withdraw error:', error);
        toast({
          title: 'Emergency Withdraw Error',
          description: error.message || 'Failed to emergency withdraw',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { emergencyWithdraw, isLoading };
  };

  // USDC Write Functions
  const useFaucet = () => {
    const claimFromFaucet = async (amountInUSDC: number = 1000) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: 'faucet',
          args: [BigInt(amountInUSDC)],
        });
        
        toast({
          title: 'Claiming Tokens...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Faucet error:', error);
        toast({
          title: 'Faucet Error',
          description: error.message || 'Failed to claim tokens',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { claimFromFaucet, isLoading };
  };

  const useApproveUSDC = () => {
    const approveUSDC = async (amountInUSDC: string) => {
      if (!checkPrerequisites()) return null;

      try {
        setIsLoading(true);
        const amountWei = parseUnits(amountInUSDC, 6);
        
        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: 'approve',
          args: [ROOTRISE_ADDRESS, amountWei],
          gas: 80000n, // Set reasonable gas limit for approval
        });
        
        toast({
          title: 'Approving USDC...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Approval error:', error);
        toast({
          title: 'Approval Error',
          description: error.message || 'Failed to approve USDC',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        throw error; // Re-throw so the component can handle it
      } finally {
        setIsLoading(false);
      }
    };

    return { approveUSDC, isLoading };
  };

  const useTransferUSDC = () => {
    const transferUSDC = async (to: string, amountInUSDC: string) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        const amountWei = parseUnits(amountInUSDC, 6);
        
        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: 'transfer',
          args: [to as `0x${string}`, amountWei],
        });
        
        toast({
          title: 'Transferring USDC...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Transfer error:', error);
        toast({
          title: 'Transfer Error',
          description: error.message || 'Failed to transfer USDC',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { transferUSDC, isLoading };
  };

  const useBurnUSDC = () => {
    const burnUSDC = async (amountInUSDC: string) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        const amountWei = parseUnits(amountInUSDC, 6);
        
        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: 'burn',
          args: [amountWei],
        });
        
        toast({
          title: 'Burning USDC...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Burn error:', error);
        toast({
          title: 'Burn Error',
          description: error.message || 'Failed to burn USDC',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { burnUSDC, isLoading };
  };

  const useMintUSDC = () => {
    const mintUSDC = async (to: string, amountInUSDC: string) => {
      if (!checkPrerequisites()) return;

      try {
        setIsLoading(true);
        const amountWei = parseUnits(amountInUSDC, 6);
        
        const hash = await writeContract({
          address: MOCK_USDC_ADDRESS,
          abi: MOCK_USDC_ABI,
          functionName: 'mint',
          args: [to as `0x${string}`, amountWei],
        });
        
        toast({
          title: 'Minting USDC...',
          description: 'Transaction submitted to blockchain',
          status: 'info',
          duration: 3000,
        });
        
        return hash;
      } catch (error: any) {
        console.error('Mint error:', error);
        toast({
          title: 'Mint Error',
          description: error.message || 'Failed to mint USDC',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    return { mintUSDC, isLoading };
  };

  // Utility functions
  const formatUSDC = (amount: bigint) => {
    return formatUnits(amount, 6);
  };

  const parseUSDC = (amount: string) => {
    return parseUnits(amount, 6);
  };

  return {
    // Read functions - RootRise
    useGetTotalProjects,
    useGetProject,
    useGetContribution,
    useIsFarmerWhitelisted,
    useGetContractBalance,
    useGetProjectContributors,
    useGetMinimumContribution,
    useGetMaximumDuration,
    useGetOwner,
    useGetStablecoinAddress,
    useGetProjectCounter,
    useGetTotalContributions,
    useIsWhitelistedFarmer,
    
    // Read functions - USDC
    useUSDCBalance,
    useUSDCAllowance,
    useUSDCName,
    useUSDCSymbol,
    useUSDCDecimals,
    useUSDCTotalSupply,
    
    // Write functions - RootRise
    useAddFarmer,
    useRemoveFarmer,
    useCreateProject,
    useContribute,
    useDisburseFunds,
    useClaimRefund,
    useCloseFailedProject,
    useEmergencyWithdraw,
    
    // Write functions - USDC
    useApproveUSDC,
    useTransferUSDC,
    useBurnUSDC,
    useMintUSDC,
    useFaucet,
    
    // Utilities
    formatUSDC,
    parseUSDC,
    
    // Contract addresses
    ROOTRISE_ADDRESS,
    MOCK_USDC_ADDRESS,
    
    // Status
    isConnected,
    isCorrectNetwork,
  };
}