[BurnAuction]: #BurnAuction
[BurnAuction-blocksPerSlot-uint32]: #BurnAuction-blocksPerSlot-uint32
[BurnAuction-burnAddress-address-payable]: #BurnAuction-burnAddress-address-payable
[BurnAuction-coDefault-struct-BurnAuction-Coordinator]: #BurnAuction-coDefault-struct-BurnAuction-Coordinator
[BurnAuction-delayGenesis-uint256]: #BurnAuction-delayGenesis-uint256
[BurnAuction-genesisBlock-uint256]: #BurnAuction-genesisBlock-uint256
[BurnAuction-maxTx-uint256]: #BurnAuction-maxTx-uint256
[BurnAuction-minNextSlots-uint256]: #BurnAuction-minNextSlots-uint256
[BurnAuction-minBid-uint256]: #BurnAuction-minBid-uint256
[BurnAuction-minNextbid-uint256]: #BurnAuction-minNextbid-uint256
[BurnAuction-slotWinner-mapping-uint256----struct-BurnAuction-Coordinator-]: #BurnAuction-slotWinner-mapping-uint256----struct-BurnAuction-Coordinator-
[BurnAuction-slotBid-mapping-uint256----struct-BurnAuction-Bid-]: #BurnAuction-slotBid-mapping-uint256----struct-BurnAuction-Bid-
[BurnAuction-constructor-uint256-address-payable-uint32-uint256-uint256-uint256-uint256-address-payable-]: #BurnAuction-constructor-uint256-address-payable-uint32-uint256-uint256-uint256-uint256-address-payable-
[BurnAuction-bid-uint32-struct-BurnAuction-Coordinator-uint256-]: #BurnAuction-bid-uint32-struct-BurnAuction-Coordinator-uint256-
[BurnAuction-bidBySelf-uint32-]: #BurnAuction-bidBySelf-uint32-
[BurnAuction-bidForOthers-uint32-address-payable-]: #BurnAuction-bidForOthers-uint32-address-payable-
[BurnAuction-getCurrentWinner--]: #BurnAuction-getCurrentWinner--
[BurnAuction-block2slot-uint256-]: #BurnAuction-block2slot-uint256-
[BurnAuction-currentSlot--]: #BurnAuction-currentSlot--
[BurnAuction-getBlockNumber--]: #BurnAuction-getBlockNumber--
[BurnAuction-checkWinner-uint256-address-]: #BurnAuction-checkWinner-uint256-address-
[BurnAuction-currentBestBid-uint32-uint256-address-]: #BurnAuction-currentBestBid-uint32-uint256-address-
[Migrations]: #Migrations
[Migrations-restricted--]: #Migrations-restricted--
[Migrations-owner-address]: #Migrations-owner-address
[Migrations-last_completed_migration-uint256]: #Migrations-last_completed_migration-uint256
[Migrations-setCompleted-uint256-]: #Migrations-setCompleted-uint256-
[SafeMath]: #SafeMath
[SafeMath-add-uint256-uint256-]: #SafeMath-add-uint256-uint256-
[SafeMath-sub-uint256-uint256-]: #SafeMath-sub-uint256-uint256-
[SafeMath-sub-uint256-uint256-string-]: #SafeMath-sub-uint256-uint256-string-
[SafeMath-mul-uint256-uint256-]: #SafeMath-mul-uint256-uint256-
[SafeMath-div-uint256-uint256-]: #SafeMath-div-uint256-uint256-
[SafeMath-div-uint256-uint256-string-]: #SafeMath-div-uint256-uint256-string-
[SafeMath-mod-uint256-uint256-]: #SafeMath-mod-uint256-uint256-
[SafeMath-mod-uint256-uint256-string-]: #SafeMath-mod-uint256-uint256-string-
[hubbletest]: #hubbletest
[hubbletest-onlyCoordinator--]: #hubbletest-onlyCoordinator--
[hubbletest-burnAuction-contract-BurnAuction]: #hubbletest-burnAuction-contract-BurnAuction
[hubbletest-constructor-address-]: #hubbletest-constructor-address-
[hubbletest-submitBatch--]: #hubbletest-submitBatch--
## <span id="BurnAuction"></span> `BurnAuction`





- [`constructor(uint256 _maxTx, address payable _burnAddress, uint32 _blocksPerSlot, uint256 _delayGenesis, uint256 _minBid, uint256 _minNextSlots, uint256 _minNextbid, address payable defaultCoAddress)`][BurnAuction-constructor-uint256-address-payable-uint32-uint256-uint256-uint256-uint256-address-payable-]
- [`bid(uint32 slot, struct BurnAuction.Coordinator co, uint256 _value)`][BurnAuction-bid-uint32-struct-BurnAuction-Coordinator-uint256-]
- [`bidBySelf(uint32 _slot)`][BurnAuction-bidBySelf-uint32-]
- [`bidForOthers(uint32 _slot, address payable _coordinatorAddress)`][BurnAuction-bidForOthers-uint32-address-payable-]
- [`getCurrentWinner()`][BurnAuction-getCurrentWinner--]
- [`block2slot(uint256 numBlock)`][BurnAuction-block2slot-uint256-]
- [`currentSlot()`][BurnAuction-currentSlot--]
- [`getBlockNumber()`][BurnAuction-getBlockNumber--]
- [`checkWinner(uint256 _slot, address _winner)`][BurnAuction-checkWinner-uint256-address-]
- [`currentBestBid(uint32 slot, uint256 amount, address Coordinator)`][BurnAuction-currentBestBid-uint32-uint256-address-]

### <span id="BurnAuction-constructor-uint256-address-payable-uint32-uint256-uint256-uint256-uint256-address-payable-"></span> `constructor(uint256 _maxTx, address payable _burnAddress, uint32 _blocksPerSlot, uint256 _delayGenesis, uint256 _minBid, uint256 _minNextSlots, uint256 _minNextbid, address payable defaultCoAddress)` (public)



BurnAuction Constructor
Set first block where the first slot begin


### <span id="BurnAuction-bid-uint32-struct-BurnAuction-Coordinator-uint256-"></span> `bid(uint32 slot, struct BurnAuction.Coordinator co, uint256 _value) → uint256` (internal)



Retrieve ether amount to be burned


### <span id="BurnAuction-bidBySelf-uint32-"></span> `bidBySelf(uint32 _slot) → bool` (external)



bid for self


### <span id="BurnAuction-bidForOthers-uint32-address-payable-"></span> `bidForOthers(uint32 _slot, address payable _coordinatorAddress) → bool` (external)



bid for others using different address arguments


### <span id="BurnAuction-getCurrentWinner--"></span> `getCurrentWinner() → address` (public)



Retrieve slot winner


### <span id="BurnAuction-block2slot-uint256-"></span> `block2slot(uint256 numBlock) → uint32` (public)



Calculate slot from block number


### <span id="BurnAuction-currentSlot--"></span> `currentSlot() → uint32` (public)



Retrieve current slot


### <span id="BurnAuction-getBlockNumber--"></span> `getBlockNumber() → uint256` (public)



Retrieve block number


### <span id="BurnAuction-checkWinner-uint256-address-"></span> `checkWinner(uint256 _slot, address _winner) → bool` (public)



check if given address winner of slot or not


### <span id="BurnAuction-currentBestBid-uint32-uint256-address-"></span> `currentBestBid(uint32 slot, uint256 amount, address Coordinator)`



Event called when an Coordinator beat the current best bid of an ongoing auction



## <span id="Migrations"></span> `Migrations`





- [`restricted()`][Migrations-restricted--]
- [`setCompleted(uint256 completed)`][Migrations-setCompleted-uint256-]

### <span id="Migrations-restricted--"></span> `restricted()`





### <span id="Migrations-setCompleted-uint256-"></span> `setCompleted(uint256 completed)` (public)







## <span id="SafeMath"></span> `SafeMath`



Wrappers over Solidity's arithmetic operations with added overflow
checks.

Arithmetic operations in Solidity wrap on overflow. This can easily result
in bugs, because programmers usually assume that an overflow raises an
error, which is the standard behavior in high level programming languages.
`SafeMath` restores this intuition by reverting the transaction when an
operation overflows.

Using this library instead of the unchecked operations eliminates an entire
class of bugs, so it's recommended to use it always.

- [`add(uint256 a, uint256 b)`][SafeMath-add-uint256-uint256-]
- [`sub(uint256 a, uint256 b)`][SafeMath-sub-uint256-uint256-]
- [`sub(uint256 a, uint256 b, string errorMessage)`][SafeMath-sub-uint256-uint256-string-]
- [`mul(uint256 a, uint256 b)`][SafeMath-mul-uint256-uint256-]
- [`div(uint256 a, uint256 b)`][SafeMath-div-uint256-uint256-]
- [`div(uint256 a, uint256 b, string errorMessage)`][SafeMath-div-uint256-uint256-string-]
- [`mod(uint256 a, uint256 b)`][SafeMath-mod-uint256-uint256-]
- [`mod(uint256 a, uint256 b, string errorMessage)`][SafeMath-mod-uint256-uint256-string-]

### <span id="SafeMath-add-uint256-uint256-"></span> `add(uint256 a, uint256 b) → uint256` (internal)



Returns the addition of two unsigned integers, reverting on
overflow.

Counterpart to Solidity's `+` operator.

Requirements:
- Addition cannot overflow.

### <span id="SafeMath-sub-uint256-uint256-"></span> `sub(uint256 a, uint256 b) → uint256` (internal)



Returns the subtraction of two unsigned integers, reverting on
overflow (when the result is negative).

Counterpart to Solidity's `-` operator.

Requirements:
- Subtraction cannot overflow.

### <span id="SafeMath-sub-uint256-uint256-string-"></span> `sub(uint256 a, uint256 b, string errorMessage) → uint256` (internal)



Returns the subtraction of two unsigned integers, reverting with custom message on
overflow (when the result is negative).

Counterpart to Solidity's `-` operator.

Requirements:
- Subtraction cannot overflow.

_Available since v2.4.0._

### <span id="SafeMath-mul-uint256-uint256-"></span> `mul(uint256 a, uint256 b) → uint256` (internal)



Returns the multiplication of two unsigned integers, reverting on
overflow.

Counterpart to Solidity's `*` operator.

Requirements:
- Multiplication cannot overflow.

### <span id="SafeMath-div-uint256-uint256-"></span> `div(uint256 a, uint256 b) → uint256` (internal)



Returns the integer division of two unsigned integers. Reverts on
division by zero. The result is rounded towards zero.

Counterpart to Solidity's `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:
- The divisor cannot be zero.

### <span id="SafeMath-div-uint256-uint256-string-"></span> `div(uint256 a, uint256 b, string errorMessage) → uint256` (internal)



Returns the integer division of two unsigned integers. Reverts with custom message on
division by zero. The result is rounded towards zero.

Counterpart to Solidity's `/` operator. Note: this function uses a
`revert` opcode (which leaves remaining gas untouched) while Solidity
uses an invalid opcode to revert (consuming all remaining gas).

Requirements:
- The divisor cannot be zero.

_Available since v2.4.0._

### <span id="SafeMath-mod-uint256-uint256-"></span> `mod(uint256 a, uint256 b) → uint256` (internal)



Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
Reverts when dividing by zero.

Counterpart to Solidity's `%` operator. This function uses a `revert`
opcode (which leaves remaining gas untouched) while Solidity uses an
invalid opcode to revert (consuming all remaining gas).

Requirements:
- The divisor cannot be zero.

### <span id="SafeMath-mod-uint256-uint256-string-"></span> `mod(uint256 a, uint256 b, string errorMessage) → uint256` (internal)



Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
Reverts with custom message when dividing by zero.

Counterpart to Solidity's `%` operator. This function uses a `revert`
opcode (which leaves remaining gas untouched) while Solidity uses an
invalid opcode to revert (consuming all remaining gas).

Requirements:
- The divisor cannot be zero.

_Available since v2.4.0._



## <span id="hubbletest"></span> `hubbletest`





- [`onlyCoordinator()`][hubbletest-onlyCoordinator--]
- [`constructor(address _burnauction)`][hubbletest-constructor-address-]
- [`submitBatch()`][hubbletest-submitBatch--]

### <span id="hubbletest-onlyCoordinator--"></span> `onlyCoordinator()`





### <span id="hubbletest-constructor-address-"></span> `constructor(address _burnauction)` (public)





### <span id="hubbletest-submitBatch--"></span> `submitBatch() → bool` (external)





