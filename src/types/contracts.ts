// types/contracts.ts - Updated with real ABIs from Remix compilation

// Smart Contract Types for RootRise Platform
export interface Project {
  farmer: string;
  title: string;
  goal: bigint;
  deadline: bigint;
  amountRaised: bigint;
  isOpen: boolean;
  fundsDisbursed: boolean;
  createdAt: bigint;
}

export interface ProjectWithId extends Project {
  id: number;
}

export interface ContributionInfo {
  amount: bigint;
  timestamp: bigint;
  contributor: string;
}

export interface FarmerProfile {
  address: string;
  isWhitelisted: boolean;
  totalProjects: number;
  totalFunded: bigint;
  successRate: number;
}

export interface InvestorProfile {
  address: string;
  totalContributions: bigint;
  projectsSupported: number;
  averageContribution: bigint;
}

// Real RootRise Smart Contract ABI from Remix compilation
export const ROOTRISE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_stablecoinAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ContributionMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FarmerAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FarmerRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FundsDisbursed",
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
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "successful",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProjectClosed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "goal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "ProjectCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "RefundClaimed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAXIMUM_DURATION",
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
    "inputs": [],
    "name": "MINIMUM_CONTRIBUTION",
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
        "name": "_farmerAddress",
        "type": "address"
      }
    ],
    "name": "addFarmer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "claimRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "closeFailedProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "contributions",
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
        "name": "_farmer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_goal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationInDays",
        "type": "uint256"
      }
    ],
    "name": "createProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "disburseFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
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
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_contributor",
        "type": "address"
      }
    ],
    "name": "getContribution",
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
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "getProject",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "farmer",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "goal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountRaised",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isOpen",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "fundsDisbursed",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct RootRiseCrowdfunding.Project",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "getProjectContributors",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProjects",
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
        "name": "_farmer",
        "type": "address"
      }
    ],
    "name": "isFarmerWhitelisted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "projectContributors",
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
    "name": "projectCounter",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "projects",
    "outputs": [
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "goal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountRaised",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isOpen",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "fundsDisbursed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
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
        "name": "_farmerAddress",
        "type": "address"
      }
    ],
    "name": "removeFarmer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stablecoin",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "totalContributions",
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
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelistedFarmers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Mock USDC Contract ABI (keep the existing one - it should be fine)
export const MOCK_USDC_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" },
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" },
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" },
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" },
    ],
    "name": "transferFrom",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_amount", "type": "uint256" },
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [{ "name": "_amount", "type": "uint256" }],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [{ "name": "_amount", "type": "uint256" }],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "name": "_newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" },
    ],
    "name": "Transfer",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "owner", "type": "address" },
      { "indexed": true, "name": "spender", "type": "address" },
      { "indexed": false, "name": "value", "type": "uint256" },
    ],
    "name": "Approval",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" },
    ],
    "name": "TokensMinted",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "previousOwner", "type": "address" },
      { "indexed": true, "name": "newOwner", "type": "address" },
    ],
    "name": "OwnershipTransferred",
    "type": "event",
  },
] as const;

// Helper type for contract function calls
export type ContractFunction = 'read' | 'write';

// Transaction status types
export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

// Event filter types
export interface EventFilter {
  fromBlock?: number;
  toBlock?: number;
  address?: string;
  topics?: string[];
}

// Contract interaction types
export interface ContractCallOptions {
  gasLimit?: bigint;
  gasPrice?: bigint;
  value?: bigint;
}

// Project status enum
export enum ProjectStatus {
  ACTIVE = 'active',
  FUNDED = 'funded',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// User role enum
export enum UserRole {
  INVESTOR = 'investor',
  FARMER = 'farmer',
  ADMIN = 'admin',
}

// Transaction receipt with explicit event type
export interface TransactionReceipt {
  hash: string;
  blockNumber: number;
  gasUsed: bigint;
  status: 'success' | 'reverted';
  events?: Array<{ event: string; args: Record<string, string | number | boolean | bigint> }>;
}

// Error type with explicit transaction type
export interface ContractError extends Error {
  code?: number;
  reason?: string;
  transaction?: { hash: string; data?: string };
}

// Default export as named variable
const contractTypes = {
  ROOTRISE_ABI,
  MOCK_USDC_ABI,
  ProjectStatus,
  UserRole,
};

export default contractTypes;