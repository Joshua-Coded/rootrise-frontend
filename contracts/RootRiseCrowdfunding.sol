import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


/**
 * @title RootRiseCrowdfunding
 * @author Joshua Alana
 * @notice A managed, stablecoin-based crowdfunding platform for verified Rwandan agricultural projects
 * @dev Uses ERC-20 stablecoins for price stability and includes comprehensive security measures
 */
contract RootRiseCrowdfunding is Ownable {
    IERC20 public stablecoin;
    
    // Constants
    uint256 public constant MINIMUM_CONTRIBUTION = 1 * 10**6; // 1 USDC (6 decimals)
    uint256 public constant MAXIMUM_DURATION = 365 days;

    // Project counter
    uint256 public projectCounter;

    // Project structure
    struct Project {
        address farmer;
        string title;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool isOpen;
        bool fundsDisbursed;
        uint256 createdAt;
    }

    // Mappings
    mapping(uint256 => Project) public projects;
    mapping(address => bool) public whitelistedFarmers;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public projectContributors;
    mapping(address => uint256) public totalContributions;

    // Events
    event ProjectCreated(
        uint256 indexed id,
        address indexed farmer,
        string title,
        uint256 goal,
        uint256 deadline
    );
    
    event ContributionMade(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount,
        uint256 timestamp
    );
    
    event FundsDisbursed(
        uint256 indexed projectId,
        address indexed farmer,
        uint256 amount,
        uint256 timestamp
    );
    
    event RefundClaimed(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount,
        uint256 timestamp
    );
    
    event FarmerAdded(address indexed farmer, uint256 timestamp);
    event FarmerRemoved(address indexed farmer, uint256 timestamp);
    event ProjectClosed(uint256 indexed projectId, bool successful, uint256 timestamp);

    /**
     * @dev Initialize the contract with stablecoin address
     * @param _stablecoinAddress Address of the ERC-20 stablecoin contract
     */
    constructor(address _stablecoinAddress) Ownable(msg.sender) {
        require(_stablecoinAddress != address(0), "Invalid stablecoin address");
        stablecoin = IERC20(_stablecoinAddress);
    }

    // Modifiers
    modifier onlyWhitelistedFarmer() {
        require(whitelistedFarmers[msg.sender], "Not a whitelisted farmer");
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectCounter, "Project does not exist");
        _;
    }

    /**
     * @notice Adds a farmer's address to the whitelist. Only the owner can call this.
     * @param _farmerAddress The address of the farmer to add
     */
    function addFarmer(address _farmerAddress) external onlyOwner {
        require(_farmerAddress != address(0), "Invalid farmer address");
        require(!whitelistedFarmers[_farmerAddress], "Farmer already whitelisted");
        
        whitelistedFarmers[_farmerAddress] = true;
        emit FarmerAdded(_farmerAddress, block.timestamp);
    }

    /**
     * @notice Removes a farmer's address from the whitelist
     * @param _farmerAddress The address of the farmer to remove
     */
    function removeFarmer(address _farmerAddress) external onlyOwner {
        require(whitelistedFarmers[_farmerAddress], "Farmer not whitelisted");
        
        whitelistedFarmers[_farmerAddress] = false;
        emit FarmerRemoved(_farmerAddress, block.timestamp);
    }

    /**
     * @notice Creates a new project for the calling farmer. Only whitelisted farmers can call.
     * @param _title The project title/description
     * @param _goal The funding goal in stablecoin units
     * @param _durationInDays The project duration in days
     */
    function createProject(
        string memory _title,
        uint256 _goal,
        uint256 _durationInDays
    ) external onlyWhitelistedFarmer {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_goal >= MINIMUM_CONTRIBUTION, "Goal too low");
        require(_durationInDays > 0 && _durationInDays <= MAXIMUM_DURATION / 1 days, "Invalid duration");

        projectCounter++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        projects[projectCounter] = Project({
            farmer: msg.sender,
            title: _title,
            goal: _goal,
            deadline: deadline,
            amountRaised: 0,
            isOpen: true,
            fundsDisbursed: false,
            createdAt: block.timestamp
        });

        emit ProjectCreated(projectCounter, msg.sender, _title, _goal, deadline);
    }

    /**
     * @notice Admin can create projects for farmers (backward compatibility)
     * @param _farmer The farmer's wallet address. Must be whitelisted.
     * @param _title The project title/description
     * @param _goal The funding goal in stablecoin units
     * @param _durationInDays The project duration in days
     */
    function createProjectForFarmer(
        address _farmer,
        string memory _title,
        uint256 _goal,
        uint256 _durationInDays
    ) external onlyOwner {
        require(whitelistedFarmers[_farmer], "Farmer not whitelisted");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_goal >= MINIMUM_CONTRIBUTION, "Goal too low");
        require(_durationInDays > 0 && _durationInDays <= MAXIMUM_DURATION / 1 days, "Invalid duration");

        projectCounter++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        projects[projectCounter] = Project({
            farmer: _farmer,
            title: _title,
            goal: _goal,
            deadline: deadline,
            amountRaised: 0,
            isOpen: true,
            fundsDisbursed: false,
            createdAt: block.timestamp
        });

        emit ProjectCreated(projectCounter, _farmer, _title, _goal, deadline);
    }

    /**
     * @notice Contribute stablecoins to a project. User must approve this contract first.
     * @param _projectId The ID of the project to contribute to
     * @param _amount The amount of stablecoins to contribute
     */
    function contribute(uint256 _projectId, uint256 _amount) external projectExists(_projectId) {
        Project storage project = projects[_projectId];
        
        require(project.isOpen, "Project is closed");
        require(block.timestamp < project.deadline, "Project deadline passed");
        require(_amount >= MINIMUM_CONTRIBUTION, "Contribution too small");
        require(stablecoin.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // Transfer stablecoins from contributor to contract
        require(stablecoin.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        // Update contribution records
        if (contributions[_projectId][msg.sender] == 0) {
            projectContributors[_projectId].push(msg.sender);
        }
        
        contributions[_projectId][msg.sender] += _amount;
        totalContributions[msg.sender] += _amount;
        project.amountRaised += _amount;

        emit ContributionMade(_projectId, msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Disburse funds if goal is met. Can be called by anyone after deadline.
     * @param _projectId The ID of the project to disburse funds for
     */
    function disburseFunds(uint256 _projectId) external projectExists(_projectId) {
        Project storage project = projects[_projectId];
        
        require(project.isOpen, "Project is closed");
        require(project.amountRaised >= project.goal, "Goal not met");
        require(!project.fundsDisbursed, "Funds already disbursed");

        project.fundsDisbursed = true;
        
        // Transfer funds to farmer
        require(stablecoin.transfer(project.farmer, project.amountRaised), "Transfer failed");

        emit FundsDisbursed(_projectId, project.farmer, project.amountRaised, block.timestamp);
    }

    /**
     * @notice Claim a refund if project failed to meet goal
     * @param _projectId The ID of the project to claim refund from
     */
    function claimRefund(uint256 _projectId) external projectExists(_projectId) {
        Project storage project = projects[_projectId];
        
        require(!project.isOpen || block.timestamp >= project.deadline, "Project still active");
        require(project.amountRaised < project.goal, "Project was successful");
        require(!project.fundsDisbursed, "Funds already disbursed");
        
        uint256 contributionAmount = contributions[_projectId][msg.sender];
        require(contributionAmount > 0, "No contribution found");

        // Reset contribution to prevent double refunds
        contributions[_projectId][msg.sender] = 0;
        totalContributions[msg.sender] -= contributionAmount;

        // Transfer refund
        require(stablecoin.transfer(msg.sender, contributionAmount), "Refund failed");

        emit RefundClaimed(_projectId, msg.sender, contributionAmount, block.timestamp);
    }

    /**
     * @notice Close a project that failed to meet its goal (admin only)
     * @param _projectId The ID of the project to close
     */
    function closeFailedProject(uint256 _projectId) external onlyOwner projectExists(_projectId) {
        Project storage project = projects[_projectId];
        
        require(project.isOpen, "Project already closed");
        require(block.timestamp >= project.deadline, "Project still active");
        require(project.amountRaised < project.goal, "Project was successful");

        project.isOpen = false;
        emit ProjectClosed(_projectId, false, block.timestamp);
    }

    /**
     * @notice Emergency function to withdraw contract balance (admin only)
     * @dev Should only be used in emergency situations
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = stablecoin.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        require(stablecoin.transfer(owner(), balance), "Emergency withdrawal failed");
    }

    // View functions
    function getTotalProjects() external view returns (uint256) {
        return projectCounter;
    }

    function getProject(uint256 _projectId) external view projectExists(_projectId) returns (Project memory) {
        return projects[_projectId];
    }

    function getContribution(uint256 _projectId, address _contributor) external view returns (uint256) {
        return contributions[_projectId][_contributor];
    }

    function getProjectContributors(uint256 _projectId) external view projectExists(_projectId) returns (address[] memory) {
        return projectContributors[_projectId];
    }

    function isFarmerWhitelisted(address _farmer) external view returns (bool) {
        return whitelistedFarmers[_farmer];
    }

    function getContractBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }
}