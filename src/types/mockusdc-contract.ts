// types/mockusdc-contract.ts - MockUSDC Token Contract Types

// Token-related interfaces
export interface TokenBalance {
    address: string;
    balance: bigint;
    formattedBalance: string;
  }
  
  export interface TokenAllowance {
    owner: string;
    spender: string;
    allowance: bigint;
    formattedAllowance: string;
  }
  
  export interface TokenTransfer {
    from: string;
    to: string;
    amount: bigint;
    timestamp: number;
    transactionHash: string;
  }
  
  // MockUSDC Smart Contract ABI - Complete from deployment
  export const MOCK_USDC_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_decimals",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "faucet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;
  
  // Event types for MockUSDC
  export interface ApprovalEvent {
    owner: string;
    spender: string;
    value: bigint;
  }
  
  export interface TransferEvent {
    from: string;
    to: string;
    value: bigint;
  }
  
  export interface TokensMintedEvent {
    to: string;
    amount: bigint;
  }
  
  export interface OwnershipTransferredEvent {
    previousOwner: string;
    newOwner: string;
  }
  
  // Token constants
  export const USDC_DECIMALS = 6;
  export const USDC_SYMBOL = 'USDC';
  export const USDC_NAME = 'USD Coin';
  
  // Utility functions for token operations
  export const formatTokenAmount = (amount: bigint, decimals: number = USDC_DECIMALS): string => {
    const divisor = BigInt(10 ** decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;
    
    if (fractionalPart === 0n) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    return trimmedFractional ? `${wholePart}.${trimmedFractional}` : wholePart.toString();
  };
  
  export const parseTokenAmount = (amount: string, decimals: number = USDC_DECIMALS): bigint => {
    const [wholePart = '0', fractionalPart = ''] = amount.split('.');
    
    // Pad or truncate fractional part to match decimals
    const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
    
    const wholePartBigInt = BigInt(wholePart);
    const fractionalPartBigInt = BigInt(paddedFractional);
    const multiplier = BigInt(10 ** decimals);
    
    return wholePartBigInt * multiplier + fractionalPartBigInt;
  };
  
  export const formatUSDCAmount = (amount: bigint): string => {
    return formatTokenAmount(amount, USDC_DECIMALS);
  };
  
  export const parseUSDCAmount = (amount: string): bigint => {
    return parseTokenAmount(amount, USDC_DECIMALS);
  };
  
  // Helper to check if amount is valid
  export const isValidTokenAmount = (amount: string): boolean => {
    try {
      const parsed = parseFloat(amount);
      return !isNaN(parsed) && parsed >= 0 && parsed < Number.MAX_SAFE_INTEGER;
    } catch {
      return false;
    }
  };
  
  // Helper to format for display with currency symbol
  export const formatUSDCDisplay = (amount: bigint): string => {
    return `${formatUSDCAmount(amount)}`;
  };
  
  // Helper to get maximum allowance (for infinite approvals)
  export const getMaxAllowance = (): bigint => {
    return BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  };
  
  // Helper to check if allowance is sufficient
  export const isSufficientAllowance = (allowance: bigint, requiredAmount: bigint): boolean => {
    return allowance >= requiredAmount;
  };
  
  // Helper to check if balance is sufficient
  export const isSufficientBalance = (balance: bigint, requiredAmount: bigint): boolean => {
    return balance >= requiredAmount;
  };
  
  // Helper to calculate percentage of total supply
  export const calculatePercentageOfSupply = (amount: bigint, totalSupply: bigint): number => {
    if (totalSupply === 0n) return 0;
    return Number((amount * 10000n) / totalSupply) / 100; // 2 decimal precision
  };
  
  // Faucet amount constants (commonly used amounts)
  export const FAUCET_AMOUNTS = {
    SMALL: parseUSDCAmount('100'),     // $100
    MEDIUM: parseUSDCAmount('1000'),   // $1,000
    LARGE: parseUSDCAmount('10000'),   // $10,000
    WHALE: parseUSDCAmount('100000'),  // $100,000
  } as const;
  
  // Default export
  const mockUSDCContract = {
    MOCK_USDC_ABI,
    USDC_DECIMALS,
    USDC_SYMBOL,
    USDC_NAME,
    FAUCET_AMOUNTS,
    formatTokenAmount,
    parseTokenAmount,
    formatUSDCAmount,
    parseUSDCAmount,
    formatUSDCDisplay,
    isValidTokenAmount,
    getMaxAllowance,
    isSufficientAllowance,
    isSufficientBalance,
    calculatePercentageOfSupply,
  };
  
  export default mockUSDCContract;