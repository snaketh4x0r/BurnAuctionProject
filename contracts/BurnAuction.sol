pragma solidity ^0.5.15;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

contract BurnAuction {
    using SafeMath for uint256;
    
    // 1 next 1.3 bonus 10 1.3 10 0.13  1.3-1-0.13=burned
    // discuss if you want to incentivize early bidders for slots using bonus-skip for now
    // discuss need for default Coordinator-keep it-done
    // discuss need to prevent submit batches multiple times after knowing hubble architecture--handled in rollup.sol if required
    // todo use safemath
    // todo make uint types explicit-done

    // number of blocks available in slot
    uint32 public blocksPerSlot;
    // number of blocks after contract deployment for genesisBlock number
    uint256 public delayGenesis;
    // First block where the first slot begins
    uint256 public genesisBlock;
    // Maximum rollup transactions: either off-chain or on-chain transactions
    uint256 public maxTx;
    // Min differance between currentslot and auction slots
    uint256 public minNextSlots;
    // Burn Address
    address payable burnAddress;
    // Minimum bid to enter the auction
    uint256 public minBid;
    // Min next bid percentage
    uint256 public minNextbid;
    // Default Coordinator
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
        // bid amount(onchain) = sumtotalFees + targetProfit(offchain)
        uint256 amount;
        // used to indicate active auction for slot
        bool initialized;
    }

    // Mappings
    // mapping to control winner of slot
    mapping(uint256 => Coordinator) public slotWinner;
    // mapping to control bid by slot
    mapping(uint256 => Bid) public slotBid;

    // events
    /**
     * @dev Event called when an Coordinator beat the current best bid of an ongoing auction
     */
    event currentBestBid(
        uint32 slot,
        uint256 amount,
        address Coordinator,
        string url
    );

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
        uint256 _delayGenesis,
        uint256 _minBid,
        uint256 _minNextSlots,
        uint256 _minNextbid,
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
        minNextbid = _minNextbid;
        coDefault = Coordinator(coReturnAddress, coSubmitBatchAddress, coUrl);
    }

    // functions
    // todo update with natspec comments

    // todo improve this logic,fix bugs
    //pricing logic needs improvement,will come back here after writing few tests
    
    /**
     * @dev Retrieve ether amount to be burned
     * @param slot slot number
     * @param co coordinator instance
     * @param _value amount of ether sent
     * @return  burn amount
     */
    function bid(
        uint32 slot,
        Coordinator memory co,
        uint256 _value
    ) internal returns (uint256) {
        uint256 burnBid = 0;
        uint256 value = _value;
        if (slotBid[slot].initialized) {
            uint256 nextBid = (slotBid[slot].amount).add((slotBid[slot].amount.mul(minNextbid)).div(100));
            require(
                value >= nextBid,
                "bid not enough to outbid current bidder"
            );
            // refund previous bidder
            address payable previousBidder = slotWinner[slot].returnAddress;
            previousBidder.transfer(slotBid[slot].amount);
            // update burn amount
            burnBid = value.sub(slotBid[slot].amount);
        } else {
            // value should be greater than or equal to minBid
            require(value >= minBid, "bid not enough than minimum bid");
            slotBid[slot].initialized = true;
            burnBid = value;
        }
        // update slot winner
        slotWinner[slot] = co;
        // update slot price
        slotBid[slot].amount = value;
        // emit event
        emit currentBestBid(
            slot,
            slotBid[slot].amount,
            co.returnAddress,
            co.url
        );
        return burnBid;
    }

    //function by which coordinator bids for himself
    
    /**
     * @dev bid for self
     * @param _slot slot number
     * @param _url Coordinator url
     */
    function bidBySelf(
        uint32 _slot,
        string calldata _url
    ) external payable {
        require(
            _slot >= currentSlot() + minNextSlots,
            "This auction is already closed"
        );
        Coordinator memory co = Coordinator(msg.sender, msg.sender, _url);
        uint256 burnBid = bid(
            _slot,
            co,
            msg.value
        );
        burnAddress.transfer(burnBid);
    }

    //coordinator bids using others address arguments
    
    /**
     * @dev bid for others using different address arguments
     * @param _slot slot number
     * @param _returnAddress address to return funds
     * @param _submitBatchAddress address to submit batch from
     * @param _url Coordinator url
     */
    function bidForOthers(
        uint32 _slot,
        address payable _returnAddress,
        address _submitBatchAddress,
        string calldata _url
    ) external payable {
        require(
            _slot >= currentSlot() + minNextSlots,
            "This auction is already closed"
        );
        Coordinator memory co = Coordinator(
            _returnAddress,
            _submitBatchAddress,
            _url
        );
        uint256 burnBid = bid(
            _slot,
            co,
            msg.value
        );
        burnAddress.transfer(burnBid);
    }

    // function needs to be exposed-done
    
    /**
     * @dev Retrieve the current slot winner address
     * @return submitBatchAddress,returnAddress,Coordinator url,bidprice
     */
    function getCurrentWinner() external view returns ( address,
            address,
            string memory,
            uint256
        ) {
        address winner;
        address beneficiary;
        string memory url;
        uint256 amount;

        (winner, beneficiary, url, amount) = getWinner(currentSlot());
        
        if(winner != address(0x00)) {
        return (winner, beneficiary, url, amount);
        } else {
            return (
                coDefault.submitBatchAddress,
                coDefault.returnAddress,
                coDefault.url,
                0
            );
        }
        }
        
    /**
     * @dev check if given address winner of slot or not
     * @param _slot slot number
     * @param _winner winer address to be checked
     * @return bool
     */
    function checkWinner(uint256 _slot, address _winner)
        external
        view
        returns (bool)
    {
        if (coDefault.submitBatchAddress == _winner) return true;
        address coordinator = slotWinner[_slot].submitBatchAddress;
        if (coordinator == _winner) {
            return true;
        } else {
            return false;
        }
    }

    // helper functions
    
    /**
     * @dev Retrieve slot winner
     * @param _slot slot number
     * @return submitBatchAddress,returnAddress,Coordinator url,bidprice
     */
    function getWinner(uint32 _slot)
        public
        view
        returns (
            address,
            address,
            string memory,
            uint256
        )
    {
        address batchSubmitter = slotWinner[_slot].submitBatchAddress;
        if (batchSubmitter != address(0x00)) {
            address winner = slotWinner[_slot].submitBatchAddress;
            address beneficiary = slotWinner[_slot].returnAddress;
            string memory url = slotWinner[_slot].url;
            uint256 amount = slotBid[_slot].amount;
            return (winner, beneficiary, url, amount);
        } else {
            return (
                coDefault.submitBatchAddress,
                coDefault.returnAddress,
                coDefault.url,
                0
            );
        }
    }
    
    /**
     * @dev Retrieve block number
     * @return current block number
     */
    function getBlockNumber() public view returns (uint256) {
        return block.number;
    }

    /**
     * @dev Calculate slot from block number
     * @param numBlock block number
     * @return slot number
     */
    function block2slot(uint256 numBlock) public view returns (uint32) {
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
    function getBlockBySlot(uint32 slot) public view returns (uint256) {
        return (genesisBlock + slot * blocksPerSlot);
    }
}
