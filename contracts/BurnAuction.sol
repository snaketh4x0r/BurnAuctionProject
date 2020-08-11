pragma solidity ^0.5.15;

contract BurnAuction {
    
	
	// discuss if you want to incentivize early bidders for slots using bonus
	// todo make uint types explicit
	// decide if co ordinator should be allowed to withdraw bid
	
	
	// constants 
	// Defines slot block duration
	// number of blocks avaible in slot
	uint32 constant public BLOCKS_PER_SLOT = 100;
	// number of blocks after contract deployment for genesisBlock number
    uint constant public DELAY_GENESIS = 1000;
	// deadline after which slot not available for bidding
    uint constant public SLOT_DEADLINE = 20;
	// Minimum bid to enter the auction
    uint public constant MIN_BID = 1 ether;
	// Min differance between currentslot and auction slots
    uint constant MIN_NEXT_SLOTS = 2;
	
	// variables
	// First block where the first slot begins
    uint public genesisBlock;
	// Maximum rollup transactions: either off-chain or on-chain transactions
    uint public maxTx;
	// Burn Address
    address payable burnAddress;
    // Default Coordinator
	// will have to decide if we want to keep default Coordinator or not
    Coordinator public coDefault;
	// profit per auction slot by Coordinator
    uint public targetProfit;
	// sum of fees of all transactions included in slot
	uint public sumtotalFees;
	
	// Coordinator structure
    struct Coordinator {
	    // address to return Coordinator failed bid amount back
        address payable beneficiaryAddress;
		// Coordinator address having right to submit batch
        address submitAddress;
		//might not need this
		// address to sends funds if bid withdrawn
        address withdrawAddress;
		// Coordinator url 
        string url;
    }

    // bid structure
    struct Bid {
	    // bid amount
        uint amount;
		// used to indicate active auction for slot
        bool initialized;
    }
	
	// information of slot structure
    struct InfoSlot {
        // current price of slot
        uint slotPrice;
        // current max target profit on slot
		uint maxtargetProfit;
    }
	
	// Mappings
	// mapping to control winner of slot
    mapping(uint => Coordinator) public slotWinner;
    // mapping to control bid by slot
    mapping(uint => Bid) public slotBid;
    // mapping to control information of slot
    mapping(uint => InfoSlot) public infoSlot;
	
	// events
	/**
     * @dev Event called when an Coordinator beat the current best bid of an ongoing auction
     */
    event currentBestBid(uint32 slot, uint256 amount, uint256 price, address Coordinator, string url);
    
	// todo move all governance parameters in Constructor
	/**
     * @dev BurnAuction Constructor
     * Set first block where the first slot begin
     * @param _burnAddress burner address
     * @param _maxTx maximum transactions
     */
    constructor(uint256 _maxTx, address payable _burnAddress) public {
        genesisBlock = getBlockNumber() + DELAY_GENESIS;
        maxTx = _maxTx;
        burnAddress = _burnAddress;
    }
	
	// functions
	
	
	//helper functions
	/**
     * @dev Retrieve block number
     * @return current block number
     */
    function getBlockNumber() public view virtual returns (uint) {
        return block.number;
    }

    /**
     * @dev Calculate slot from block number
     * @param numBlock block number
     * @return slot number
     */
    function block2slot(uint numBlock) public view returns (uint32) {
        if (numBlock < genesisBlock) return 0;
        return uint32((numBlock - genesisBlock) / (BLOCKS_PER_SLOT));
    }
	
	/**
     * @dev Retrieve current slot
     * @return slot number
     */
    function currentSlot() public view returns (uint32) {
        return block2slot(getBlockNumber());
    }

    /**
     * @dev Retrieve the first block number for a given slot
     * @param slot slot number
     * @return block number
     */
    function getBlockBySlot(uint32 slot) public view returns (uint) {
        return (genesisBlock + slot*BLOCKS_PER_SLOT);
    }
}