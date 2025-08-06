export const ROOTRISE_ABI = [
    {
      "inputs": [
        {"internalType": "address", "name": "_stablecoinAddress", "type": "address"}
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "ContributionMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "farmer", "type": "address"},
        {"indexed": false, "internalType": "string", "name": "documentsHash", "type": "string"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "FarmerApplicationSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "farmer", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "admin", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "FarmerApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "farmer", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "admin", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "FarmerRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
        {"indexed": true, "internalType": "address", "name": "farmer", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "FundsReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": true, "internalType": "address", "name": "admin", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "ProjectApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": false, "internalType": "bool", "name": "successful", "type": "bool"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "ProjectClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": true, "internalType": "address", "name": "farmer", "type": "address"},
        {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
        {"indexed": false, "internalType": "uint256", "name": "fundingGoal", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "ProjectCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": true, "internalType": "address", "name": "farmer", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "ProjectSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
      ],
      "name": "RefundClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32"},
        {"indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32"}
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"indexed": true, "internalType": "address", "name": "account", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "sender", "type": "address"}
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"indexed": true, "internalType": "address", "name": "account", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "sender", "type": "address"}
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "FARMER_ROLE",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "GOVERNMENT_ROLE",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAXIMUM_DURATION",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MINIMUM_CONTRIBUTION",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_official", "type": "address"}
      ],
      "name": "addGovernmentOfficial",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_farmer", "type": "address"}
      ],
      "name": "approveFarmer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"}
      ],
      "name": "approveProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "", "type": "address"}
      ],
      "name": "approvedFarmers",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"}
      ],
      "name": "claimRefund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"}
      ],
      "name": "closeFailedProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"},
        {"internalType": "uint256", "name": "_amount", "type": "uint256"}
      ],
      "name": "contribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"},
        {"internalType": "address", "name": "", "type": "address"}
      ],
      "name": "contributions",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emergencyPause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emergencyUnpause",
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
      "inputs": [
        {"internalType": "address", "name": "", "type": "address"}
      ],
      "name": "farmerApplications",
      "outputs": [
        {"internalType": "address", "name": "farmerAddress", "type": "address"},
        {"internalType": "string", "name": "documentsHash", "type": "string"},
        {"internalType": "enum RootRiseV2.FarmerStatus", "name": "status", "type": "uint8"},
        {"internalType": "uint256", "name": "appliedAt", "type": "uint256"},
        {"internalType": "string", "name": "mobileMoneyAccount", "type": "string"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"},
        {"internalType": "address", "name": "_contributor", "type": "address"}
      ],
      "name": "getContribution",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"}
      ],
      "name": "getProject",
      "outputs": [
        {
          "components": [
            {"internalType": "uint256", "name": "projectId", "type": "uint256"},
            {"internalType": "address", "name": "farmer", "type": "address"},
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "uint256", "name": "fundingGoal", "type": "uint256"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "fundsRaised", "type": "uint256"},
            {"internalType": "enum RootRiseV2.ProjectStatus", "name": "status", "type": "uint8"},
            {"internalType": "string", "name": "mobileMoneyAccount", "type": "string"},
            {"internalType": "bool", "name": "fundsReleased", "type": "bool"},
            {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
          ],
          "internalType": "struct RootRiseV2.Project",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"}
      ],
      "name": "getProjectContributors",
      "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"}
      ],
      "name": "getRoleAdmin",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalProjects",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "hasRole",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_farmer", "type": "address"}
      ],
      "name": "isFarmerApproved",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"},
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "name": "projectContributors",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "projectCounter",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "name": "projects",
      "outputs": [
        {"internalType": "uint256", "name": "projectId", "type": "uint256"},
        {"internalType": "address", "name": "farmer", "type": "address"},
        {"internalType": "string", "name": "title", "type": "string"},
        {"internalType": "uint256", "name": "fundingGoal", "type": "uint256"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"internalType": "uint256", "name": "fundsRaised", "type": "uint256"},
        {"internalType": "enum RootRiseV2.ProjectStatus", "name": "status", "type": "uint8"},
        {"internalType": "string", "name": "mobileMoneyAccount", "type": "string"},
        {"internalType": "bool", "name": "fundsReleased", "type": "bool"},
        {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_farmer", "type": "address"}
      ],
      "name": "rejectFarmer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "_projectId", "type": "uint256"}
      ],
      "name": "releaseFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stablecoin",
      "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "_documentsHash", "type": "string"},
        {"internalType": "string", "name": "_mobileMoneyAccount", "type": "string"}
      ],
      "name": "submitFarmerApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "_title", "type": "string"},
        {"internalType": "uint256", "name": "_fundingGoal", "type": "uint256"},
        {"internalType": "uint256", "name": "_durationInDays", "type": "uint256"},
        {"internalType": "string", "name": "_mobileMoneyAccount", "type": "string"}
      ],
      "name": "submitProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}
      ],
      "name": "supportsInterface",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "", "type": "address"}
      ],
      "name": "totalContributions",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];