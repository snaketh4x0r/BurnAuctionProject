import * as chai from "chai";
import { ethers } from "ethers";
import { BurnAuctionContract } from "../types/truffle-contracts/index";
//import * as walletHelper from "../scripts/helpers/wallet";
const truffleAssert = require("truffle-assertions");
const advance = require("truffle-test-helpers");
const BurnAuction = artifacts.require("BurnAuction");

let accounts = web3.eth.getAccounts();

contract("BurnAuction", async function(accounts) {
	
	// todo assert reverts,complete event params,balance checks,
	// improve coverage
	let burnAuctionInstance: any;
	let wallets: any;
	// accounts[0]
	let CoordinatorDefault: any;
	// accounts[1]
	let CoordinatorA: any;
	// accounts[2]
	let CoordinatorB: any;
	// accounts[3]
	let CoordinatorC: any;
	// accounts[4]
	let CoordinatorD: any;
	let blocknumber: number;
	const blocksperslot: number = 40;
	const maxtx: number = 100;
	const minbid: number = 10000000000;
	const minnextslot: number = 2;
	const minnextbid: number = 30;
	const delay: number = 0;
	const url: string = "hellocord.com";
	//const delay:number = 100;
	
	// flow
	// during slot 0->Bid on slot 3 by A,overbid by B
	// skip two slots 
	// so now on slot 2
	// during slot 2->Bid on slot 4 by C,overbid by D
	// check winner for slot 3->CoordinatorB
	// check winner for slot 4->CoordinatorD
	// check winner for slot 0,1,2->Default Coordinator
    	
	before(async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		});
	
   	
	it('should check the BurnAuction Contract deployed or not', async function() {
		//console.log(burnAuctionInstance.address);
		assert(burnAuctionInstance.address !== '');
	});
		
	// functional tests
	
	it('Make winning Bid by self for Slot 3', async function() {
		let currentslot = await burnAuctionInstance.currentSlot();
		let slottoBid = currentslot.toNumber() + 3;
		// make bid by coordinator a on first auction slot available
		let tx1 = await burnAuctionInstance.bidBySelf(slottoBid,url,{from: accounts[1],value:minbid});
		let bid1 = await burnAuctionInstance.slotBid(slottoBid);
		// checks for bid by coordinator a successful or not
		truffleAssert.eventEmitted(tx1,'currentBestBid');
		// check tx1 succesful
	    let tx1status = tx1.receipt.status;
		assert( tx1status === true );
		// check auction initialized
		assert( bid1[1] === true );
		// bidamount bidded is same as minbid sent
		assert( (bid1[0]).toNumber() === minbid );
		// check coordinator A is winner for slot currently
		let initialwinner = await burnAuctionInstance.checkWinner(slottoBid,accounts[1]);
		assert ( initialwinner == true );
		// check change in balances of a 
		// check amount burnt succesfully
		// calculate overbid amount
		let previousbid = await burnAuctionInstance.slotBid(slottoBid);
        let prevbidamount = (previousbid[0]).toNumber();
		let nextbidamount = prevbidamount + ((prevbidamount*minnextbid)/100);
		// overbid by coordinator b
		let tx2 = await burnAuctionInstance.bidBySelf(slottoBid,url,{from: accounts[2],value:nextbidamount});
		// check tx2 succesful
	    let tx2status = tx2.receipt.status;
		assert( tx2status === true );
		truffleAssert.eventEmitted(tx2,'currentBestBid');
		let bid2 = await burnAuctionInstance.slotBid(slottoBid);
		// check if auction stays initialized
		assert( bid2[1] === true );
		// check if bid amount for bidding slot changed to new bid amount
		assert( (bid2[0]).toNumber() === nextbidamount );
		// check if slot winner updated correctly
		let overbidwinner = await burnAuctionInstance.checkWinner(slottoBid,accounts[2]);
		assert ( overbidwinner == true );
		// check balance returned to a
		// check change in balances of b and burnaddress balance	
	});
	
	// skip two slots 
	skipslot();
	skipslot();
	
	it('Make winning Bid for others for slot 4',async function() {
		let slottoBid = 4;
		let returnaddrC = accounts[3];
		let subaddrC = accounts[3];
		let tx1 = await burnAuctionInstance.bidForOthers(slottoBid,returnaddrC,subaddrC,url,{from: accounts[3],value:minbid});
		let bid1 = await burnAuctionInstance.slotBid(slottoBid);
		// check tx1 succesful
	    let tx1status = tx1.receipt.status;
		assert( tx1status === true );
		// checks for bid by coordinator c successful or not
		truffleAssert.eventEmitted(tx1,'currentBestBid');
		// check auction initialized
		assert( bid1[1] === true );
		// bidamount bidded is same as minbid sent
		assert( (bid1[0]).toNumber() === minbid );
		// check coordinator C is winner for slot currently
		let initialwinner = await burnAuctionInstance.checkWinner(slottoBid,accounts[3]);
		assert ( initialwinner == true );
		// check change in balances of c
		// check amount burnt succesfully
		// calculate overbid amount
		let previousbid = await burnAuctionInstance.slotBid(slottoBid);
        let prevbidamount = (previousbid[0]).toNumber();
		let nextbidamount = prevbidamount + ((prevbidamount*minnextbid)/100);
		// overbid by coordinator d
		// check successful
		// check balance changes
	});
		
	// check slots after this to match winners
	// use get winner for this
	// check for default co address on slots with no bids also	 
	
	
	// helpers
	function skipblocks(currentblock:number,block:number) {
		let blocktoskip = currentblock + block; 
		advance.advanceToBlock(blocktoskip);
	};
	
	function skipnblocks(block:number) {
		for(let i=0;i<=block;i++){
			advance.advanceBlock();
		}
	};
	
    function skipslot() {
		let block = blocksperslot;
		for(let i=0;i<=block;i++){
			advance.advanceBlock();
		}
	};
	
	function skiptoauctionslot() {
		let block = blocksperslot + 40;
		for(let i=0;i<=block;i++){
			advance.advanceBlock();
		}
	};
});