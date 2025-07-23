import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


/**
 * @title MockUSDC
 * @author [Your Name]
 * @notice A mock ERC-20 token for testing the RootRise crowdfunding platform
 * @dev This contract simulates USDC for testing purposes on testnets
 */
contract MockUSDC is ERC20 {
    
    uint8 private _tokenDecimals;
    address public owner;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Constructor that sets up the mock USDC token
     * @param _name Token name (e.g., "Mock USD Coin")
     * @param _symbol Token symbol (e.g., "USDC")
     * @param _decimals Number of decimals (USDC uses 6)
     * @param _initialSupply Initial supply to mint to deployer
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        _tokenDecimals = _decimals;
        owner = msg.sender;
        
        // Mint initial supply to deployer
        _mint(msg.sender, _initialSupply * (10 ** _decimals));
        
        emit TokensMinted(msg.sender, _initialSupply * (10 ** _decimals));
    }
    
    /**
     * @dev Returns the number of decimals used for token amounts
     * @return Number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _tokenDecimals;
    }
    
    /**
     * @notice Mint new tokens (only owner can call)
     * @param _to Address to mint tokens to
     * @param _amount Amount of tokens to mint (in token units, not wei)
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Cannot mint to zero address");
        require(_amount > 0, "Amount must be greater than 0");
        
        _mint(_to, _amount * (10 ** _tokenDecimals));
        emit TokensMinted(_to, _amount * (10 ** _tokenDecimals));
    }
    
    /**
     * @notice Faucet function - allows anyone to mint tokens for testing
     * @param _amount Amount of tokens to mint (in token units)
     */
    function faucet(uint256 _amount) external {
        require(_amount > 0 && _amount <= 10000, "Amount must be between 1 and 10000");
        
        _mint(msg.sender, _amount * (10 ** _tokenDecimals));
        emit TokensMinted(msg.sender, _amount * (10 ** _tokenDecimals));
    }
    
    /**
     * @notice Transfer ownership of the contract
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        
        address previousOwner = owner;
        owner = _newOwner;
        
        emit OwnershipTransferred(previousOwner, _newOwner);
    }
    
    /**
     * @notice Burn tokens from caller's balance
     * @param _amount Amount of tokens to burn (in token units)
     */
    function burn(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount * (10 ** _tokenDecimals), "Insufficient balance");
        
        _burn(msg.sender, _amount * (10 ** _tokenDecimals));
    }
}