pragma solidity ^0.5.15;

contract BurnAuction {
    
	// 1 next 1.3 bonus 10 1.3 10 0.13  1.3-1-0.13=burned
	// discuss if you want to incentivize early bidders for slots using bonus skip for now
	// todo make uint types explicit
	// discuss need for default Coordinator-keep it
	// discuss need to prevent submit batches multiple times after knowing hubble architecture
		
	// number of blocks available in slot
	uint32 public blocksPerSlot;
	// number of blocks after contract deployment for genesisBlock number
	uint public delayGenesis;
	// First block where the first slot begins
    uint public genesisBlock;
	// Maximum rollup transactions: either off-chain or on-chain transactions
    uint public maxTx;
	// Min differance between currentslot and auction slots
	uint public minNextSlots;
	// Burn Address
    address payable burnAddress;
	// Minimum bid to enter the auction
	uint public minBid;
    // Default Coordinator
	// will have to decide if we want to keep default Coordinator or not
    Coordinator public coDefault;
	
	// Coordinator structure
    struct Coordinator {
	    // address to return unsuccessful bid funds back
        address payable returnAddress;
		// Coordinator address having right to submit batch
        address submitBatchAddress;
		// Coordinator url 
        string url;
    }

    // bid structure
    struct Bid {
	    // bid amount = sumtotalFees - targetProfit
        uint amount;
		// used to indicate active auction for slot
        bool initialized;
		// profit per auction slot by Coordinator
        uint targetProfit;
	    // sum of fees of all transactions included in slot
	    uint sumtotalFees;
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
    event currentBestBid(uint32 slot, uint amount, uint sumtotalFees, uint targetProfit, address Coordinator, string url);
    
	// todo move all governance parameters in Constructor-done
	/**
     * @dev BurnAuction Constructor
     * Set first block where the first slot begin
     * @param _maxTx maximum transactions
     * @param _burnAddress burner address
	 * @param _blocksPerSlot number of blocks in slot
	 * @param _delayGenesis delay genesisBlock by this
	 * @param _minBid minimum bid for a auction slot
	 * @param _minNextSlots differance between currentslot and auction slot
     */
    constructor(
	    uint256 _maxTx,
	    address payable _burnAddress,
	    uint32 _blocksPerSlot,
		uint _delayGenesis,
		uint _minBid,
		uint _minNextSlots,
		address payable coReturnAddress,
		address coSubmitBatchAddress,
		string memory coUrl
	) public {
        genesisBlock = getBlockNumber() + _delayGenesis;
        maxTx = _maxTx;
        burnAddress = _burnAddress;
		blocksPerSlot = _blocksPerSlot;
		delayGenesis = _delayGenesis;
		minBid = _minBid;
		minNextSlots = _minNextSlots;		
		coDefault = Coordinator(coReturnAddress,coSubmitBatchAddress,coUrl);
    }
	
	// functions
	//update with natspec comments
	
	function bid(
	    uint32 slot,
		Coordinator memory co,
		uint _targetProfit,
		uint _sumtotalFees
	) internal returns (uint) {
	    uint burnBid = 0;
		uint amount = 0;
		//require checks
		if(slotBid[slot].initialized) {
		
		} else {
		
		}
		slotWinner[slot] = co;
        slotBid[slot].amount = amount;
		//update infoSlot
		//emit event
		return burnBid;
	}
	
	//complete them-done
	
	//function by which coordinator bids for himself
	function bidBySelf(uint32 _slot, string calldata _url, uint _targetProfit, uint _sumtotalFees) external payable {
	    require(_slot >= currentSlot() + minNextSlots, 'This auction is already closed');
	    Coordinator memory co = Coordinator(msg.sender, msg.sender, _url);
		uint burnBid = bid(_slot,co,_targetProfit,_sumtotalFees);
		burnAddress.transfer(burnBid);
	}
	
	//coordinator bids using others address arguments
	function bidForOthers(
	    uint32 _slot,
		uint _targetProfit,
		uint _sumtotalFees,
		address payable _returnAddress,
		address _submitBatchAddress,
		string calldata _url
	) external payable {
	    require(_slot >= currentSlot() + minNextSlots, 'This auction is already closed');
		Coordinator memory co = Coordinator(_returnAddress, _submitBatchAddress, _url);
		uint burnBid = bid(_slot,co,_targetProfit,_sumtotalFees);
		burnAddress.transfer(burnBid);
	}
	
	// function needs to be exposed-done
	/**
     * @dev Retrieve slot winner
     * @return submitBatchAddress,returnAddress,Coordinator url,bidamount
     */
	function getWinner(uint _slot) external view returns (address, address, string memory, uint) {
	    address batchSubmitter= slotWinner[_slot].submitBatchAddress;
		if(batchSubmitter != address(0x00)){ 
		uint256 amount = slotBid[_slot].amount;
        address winner = slotWinner[_slot].submitBatchAddress;
        address beneficiary = slotWinner[_slot].returnAddress;
        string memory url = slotWinner[_slot].url;
        return (winner, beneficiary, url, amount);
		} else {
		return (coDefault.submitBatchAddress, coDefault.returnAddress, coDefault.url, 0);
		}
	}
	
	function checkWinner(uint _slot, address _winner) external view returns (bool) {
	    if (coDefault.submitBatchAddress == _winner) return true;
		address coordinator = slotWinner[_slot].submitBatchAddress;
		if(coordinator == _winner){
			return true;
		} else {
			return false;
		}
	}
	
	//helper functions
	/**
     * @dev Retrieve block number
     * @return current block number
     */
    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    /**
     * @dev Calculate slot from block number
     * @param numBlock block number
     * @return slot number
     */
    function block2slot(uint numBlock) public view returns (uint32) {
        if (numBlock < genesisBlock) return 0;
        return uint32((numBlock - genesisBlock) / (blocksPerSlot));
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
        return (genesisBlock + slot*blocksPerSlot);
    }
}