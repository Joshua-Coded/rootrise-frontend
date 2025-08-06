import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/access/AccessControl.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC20/IERC20.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract RootRiseV2 is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");

    enum FarmerStatus { Pending, Approved, Rejected }
    enum ProjectStatus { Draft, Pending, Approved, Active, Completed }

    struct FarmerApplication {
        address farmerAddress;
        string[] documentsHashes; // Updated to array for multiple Cloudinary URLs
        FarmerStatus status;
        uint256 appliedAt;
        string mobileMoneyAccount;
    }

    struct Project {
        uint256 projectId;
        address farmer;
        string title;
        uint256 fundingGoal;
        uint256 deadline;
        uint256 fundsRaised;
        ProjectStatus status;
        string mobileMoneyAccount;
        bool fundsReleased;
        uint256 createdAt;
    }

    uint256 public constant MINIMUM_CONTRIBUTION = 1 * 10**6; // 1 USDC (6 decimals)
    uint256 public constant MAXIMUM_DURATION = 365 days;

    IERC20 public stablecoin;
    mapping(address => FarmerApplication) public farmerApplications;
    mapping(uint256 => Project) public projects;
    mapping(address => bool) public approvedFarmers;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public projectContributors;
    mapping(address => uint256) public totalContributions;
    uint256 public projectCounter;

    event FarmerApplicationSubmitted(address indexed farmer, string[] documentsHashes, uint256 timestamp);
    event FarmerApproved(address indexed farmer, address indexed admin, uint256 timestamp);
    event FarmerRejected(address indexed farmer, address indexed admin, uint256 timestamp);
    event ProjectCreated(uint256 indexed projectId, address indexed farmer, string title, uint256 fundingGoal, uint256 deadline, uint256 timestamp);
    event ProjectSubmitted(uint256 indexed projectId, address indexed farmer, uint256 timestamp);
    event ProjectApproved(uint256 indexed projectId, address indexed admin, uint256 timestamp);
    event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount, uint256 timestamp);
    event FundsReleased(uint256 indexed projectId, uint256 amount, address indexed farmer, uint256 timestamp);
    event RefundClaimed(uint256 indexed projectId, address indexed contributor, uint256 amount, uint256 timestamp);
    event ProjectClosed(uint256 indexed projectId, bool successful, uint256 timestamp);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Admin access required");
        _;
    }

    modifier onlyGovernment() {
        require(hasRole(GOVERNMENT_ROLE, msg.sender), "Government access required");
        _;
    }

    modifier onlyApprovedFarmer() {
        require(approvedFarmers[msg.sender], "Farmer approval required");
        _;
    }

    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectCounter, "Project does not exist");
        _;
    }

    constructor(address _stablecoinAddress) {
        require(_stablecoinAddress != address(0), "Invalid stablecoin address");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        stablecoin = IERC20(_stablecoinAddress);
        projectCounter = 0;
    }

    function submitFarmerApplication(string[] memory _documentsHashes, string memory _mobileMoneyAccount) 
        external 
        whenNotPaused 
    {
        require(farmerApplications[msg.sender].farmerAddress == address(0), "Application already exists");
        require(_documentsHashes.length > 0 && _documentsHashes.length <= 3, "1-3 documents required");

        farmerApplications[msg.sender] = FarmerApplication({
            farmerAddress: msg.sender,
            documentsHashes: _documentsHashes,
            status: FarmerStatus.Pending,
            appliedAt: block.timestamp,
            mobileMoneyAccount: _mobileMoneyAccount
        });

        emit FarmerApplicationSubmitted(msg.sender, _documentsHashes, block.timestamp);
    }

    function approveFarmer(address _farmer) 
        external 
        onlyAdmin 
        whenNotPaused 
    {
        require(farmerApplications[_farmer].farmerAddress != address(0), "No application found");
        require(farmerApplications[_farmer].status == FarmerStatus.Pending, "Application not pending");

        farmerApplications[_farmer].status = FarmerStatus.Approved;
        approvedFarmers[_farmer] = true;
        _grantRole(FARMER_ROLE, _farmer);

        emit FarmerApproved(_farmer, msg.sender, block.timestamp);
    }

    function rejectFarmer(address _farmer) 
        external 
        onlyAdmin 
        whenNotPaused 
    {
        require(farmerApplications[_farmer].farmerAddress != address(0), "No application found");
        require(farmerApplications[_farmer].status == FarmerStatus.Pending, "Application not pending");

        farmerApplications[_farmer].status = FarmerStatus.Rejected;
        emit FarmerRejected(_farmer, msg.sender, block.timestamp);
    }

    function submitProject(string memory _title, uint256 _fundingGoal, uint256 _durationInDays, string memory _mobileMoneyAccount) 
        external 
        onlyApprovedFarmer 
        whenNotPaused 
    {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_fundingGoal >= MINIMUM_CONTRIBUTION, "Goal too low");
        require(_durationInDays > 0 && _durationInDays <= MAXIMUM_DURATION / 1 days, "Invalid duration");

        projectCounter++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        projects[projectCounter] = Project({
            projectId: projectCounter,
            farmer: msg.sender,
            title: _title,
            fundingGoal: _fundingGoal,
            deadline: deadline,
            fundsRaised: 0,
            status: ProjectStatus.Pending,
            mobileMoneyAccount: _mobileMoneyAccount,
            fundsReleased: false,
            createdAt: block.timestamp
        });

        emit ProjectCreated(projectCounter, msg.sender, _title, _fundingGoal, deadline, block.timestamp);
        emit ProjectSubmitted(projectCounter, msg.sender, block.timestamp);
    }

    function approveProject(uint256 _projectId) 
        external 
        whenNotPaused 
        projectExists(_projectId)
    {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(GOVERNMENT_ROLE, msg.sender), 
            "Admin or Government access required"
        );
        require(projects[_projectId].status == ProjectStatus.Pending, "Project not pending");

        projects[_projectId].status = ProjectStatus.Approved;
        emit ProjectApproved(_projectId, msg.sender, block.timestamp);
    }

    function contribute(uint256 _projectId, uint256 _amount) 
        external 
        whenNotPaused 
        projectExists(_projectId)
    {
        Project storage project = projects[_projectId];
        
        require(project.status == ProjectStatus.Approved, "Project not approved");
        require(block.timestamp < project.deadline, "Project deadline passed");
        require(_amount >= MINIMUM_CONTRIBUTION, "Contribution too small");
        require(stablecoin.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(project.fundsRaised + _amount <= project.fundingGoal, "Exceeds funding goal");

        require(stablecoin.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        
        if (contributions[_projectId][msg.sender] == 0) {
            projectContributors[_projectId].push(msg.sender);
        }
        
        contributions[_projectId][msg.sender] = contributions[_projectId][msg.sender] + _amount;
        totalContributions[msg.sender] = totalContributions[msg.sender] + _amount;
        project.fundsRaised = project.fundsRaised + _amount;

        if (project.fundsRaised == project.fundingGoal) {
            project.status = ProjectStatus.Active;
        }

        emit ContributionMade(_projectId, msg.sender, _amount, block.timestamp);
    }

    function releaseFunds(uint256 _projectId) 
        external 
        onlyAdmin 
        whenNotPaused 
        projectExists(_projectId)
    {
        Project storage project = projects[_projectId];
        
        require(project.status == ProjectStatus.Active, "Project not active");
        require(!project.fundsReleased, "Funds already released");

        project.fundsReleased = true;
        project.status = ProjectStatus.Completed;
        require(stablecoin.transfer(project.farmer, project.fundsRaised), "USDC transfer failed");

        emit FundsReleased(_projectId, project.fundsRaised, project.farmer, block.timestamp);
    }

    function claimRefund(uint256 _projectId) 
        external 
        projectExists(_projectId) 
        whenNotPaused 
    {
        Project storage project = projects[_projectId];
        
        require(project.status != ProjectStatus.Active && project.status != ProjectStatus.Completed, "Project still active or completed");
        require(block.timestamp >= project.deadline || project.status == ProjectStatus.Draft, "Project still pending");
        require(project.fundsRaised < project.fundingGoal, "Project was successful");
        require(!project.fundsReleased, "Funds already disbursed");
        
        uint256 contributionAmount = contributions[_projectId][msg.sender];
        require(contributionAmount > 0, "No contribution found");

        contributions[_projectId][msg.sender] = 0;
        totalContributions[msg.sender] = totalContributions[msg.sender] - contributionAmount;

        require(stablecoin.transfer(msg.sender, contributionAmount), "Refund failed");

        emit RefundClaimed(_projectId, msg.sender, contributionAmount, block.timestamp);
    }

    function closeFailedProject(uint256 _projectId) 
        external 
        onlyAdmin 
        projectExists(_projectId) 
        whenNotPaused 
    {
        Project storage project = projects[_projectId];
        
        require(project.status == ProjectStatus.Approved || project.status == ProjectStatus.Pending, "Project not open");
        require(block.timestamp >= project.deadline, "Project still active");
        require(project.fundsRaised < project.fundingGoal, "Project was successful");

        project.status = ProjectStatus.Draft;
        emit ProjectClosed(_projectId, false, block.timestamp);
    }

    function emergencyPause() external onlyAdmin {
        _pause();
    }

    function emergencyUnpause() external onlyAdmin {
        _unpause();
    }

    function addGovernmentOfficial(address _official) external onlyAdmin {
        require(_official != address(0), "Invalid address");
        _grantRole(GOVERNMENT_ROLE, _official);
    }

    function emergencyWithdraw() external onlyAdmin {
        uint256 balance = stablecoin.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        require(stablecoin.transfer(msg.sender, balance), "Emergency withdrawal failed");
    }

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

    function isFarmerApproved(address _farmer) external view returns (bool) {
        return approvedFarmers[_farmer];
    }

    function getContractBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }
}