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

// RootRise Smart Contract ABI
export const ROOTRISE_ABI = [
  {
    inputs: [{ name: '_projectId', type: 'uint256' }],
    name: 'getProject',
    outputs: [
      {
        components: [
          { name: 'farmer', type: 'address' },
          { name: 'title', type: 'string' },
          { name: 'goal', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'amountRaised', type: 'uint256' },
          { name: 'isOpen', type: 'bool' },
          { name: 'fundsDisbursed', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalProjects',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: '_projectId', type: 'uint256' },
      { name: '_contributor', type: 'address' },
    ],
    name: 'getContribution',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_projectId', type: 'uint256' }],
    name: 'getProjectContributors',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_farmer', type: 'address' }],
    name: 'isFarmerWhitelisted',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stablecoin',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_farmerAddress', type: 'address' }],
    name: 'addFarmer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_farmerAddress', type: 'address' }],
    name: 'removeFarmer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_farmer', type: 'address' },
      { name: '_title', type: 'string' },
      { name: '_goal', type: 'uint256' },
      { name: '_durationInDays', type: 'uint256' },
    ],
    name: 'createProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_projectId', type: 'uint256' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'contribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_projectId', type: 'uint256' }],
    name: 'disburseFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_projectId', type: 'uint256' }],
    name: 'claimRefund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_projectId', type: 'uint256' }],
    name: 'closeFailedProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'farmer', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'FarmerAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'farmer', type: 'address' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'FarmerRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'id', type: 'uint256' },
      { indexed: true, name: 'farmer', type: 'address' },
      { indexed: false, name: 'title', type: 'string' },
      { indexed: false, name: 'goal', type: 'uint256' },
      { indexed: false, name: 'deadline', type: 'uint256' },
    ],
    name: 'ProjectCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'projectId', type: 'uint256' },
      { indexed: true, name: 'contributor', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'ContributionMade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'projectId', type: 'uint256' },
      { indexed: true, name: 'farmer', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'FundsDisbursed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'projectId', type: 'uint256' },
      { indexed: true, name: 'contributor', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'RefundClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'projectId', type: 'uint256' },
      { indexed: false, name: 'successful', type: 'bool' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'ProjectClosed',
    type: 'event',
  },
] as const;

// Mock USDC Contract ABI
export const MOCK_USDC_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_amount', type: 'uint256' }],
    name: 'faucet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_amount', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'TokensMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'previousOwner', type: 'address' },
      { indexed: true, name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
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
  // TransactionStatus,
  // ContractFunction,
};

export default contractTypes;