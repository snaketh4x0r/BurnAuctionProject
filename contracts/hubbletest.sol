pragma solidity ^0.5.15;

import {BurnAuction} from "./BurnAuction.sol";

// contract just for testing and writing tests
// rollup.sol
contract hubbletest {
    //external contracts
    BurnAuction public burnAuction;

    // in rollup there is contract address
    // after deployment of contracts register with registry
    constructor(address _burnauction) public {
        burnAuction = BurnAuction(_burnauction);
    }

    // verify sum of all txns fees and match with slot sum of all fess?
    function submitBatch() external payable returns (bool) {
        address returnAdd;
        address submitter;
        string memory url;
        uint256 amt;

        (submitter, returnAdd, url, amt) = burnAuction.getCurrentWinner();
        require(msg.sender == submitter, "Coordinator didn't won slot");
        return true;
    }
}
