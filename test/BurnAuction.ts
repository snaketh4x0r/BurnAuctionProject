import * as chai from "chai";
import { ethers } from "ethers";
import { BurnAuctionContract } from "../types/truffle-contracts/index";
//import * as walletHelper from "../scripts/helpers/wallet";
const truffleAssert = require("truffle-assertions");
const advance = require("truffle-test-helpers");
const BurnAuction = artifacts.require("BurnAuction");
const HubbleTest = artifacts.require("hubbletest");

let accounts = web3.eth.getAccounts();

contract("BurnAuction", async function(accounts) {
	
	let burnAuctionInstance: any;
	let wallets: any;
	let CoordinatorA: any;
	let CoordinatorB: any;
	let CoordinatorC: any;
	let CoordinatorD: any;
	let CoordinatorDefault: any;
	let blocknumber: number;
	const blocksperslot: number = 100;
	const maxtx: number = 100;
	const minbid: number = 10000000000;
	const minnextslot: number = 2;
	const minnextbid: number = 30;
	const delay: number = 0;
	const url: string = "hellocord.com";
	//const delay:number = 100;
    	
	// unit tests written in ts instead of sol or saving time
	before(async function() {
		//wallets = walletHelper.generateFirstWallets(walletHelper.mnemonics, 10);
		//burnAuctionInstance = await BurnAuction.deployed();
		//let tempGen = await burnAuctionInstance.genesisBlock();
		//genesisblock = tempGen.toNumber();
		//let initBlock = await provider.getBlockNumber();
		//genesisBlock = initBlock + delay;
		//console.log(genesisBlock);
		});
	
   	
	it('should deploy the BurnAuction Contract', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		//console.log(burnAuctionInstance.address);
		assert(burnAuctionInstance.address !== '');
	});
	
    // slots for self functionality from 2-10
	it('should not bid on current slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		try{
		let currentslot = await burnAuctionInstance.currentSlot();
		await burnAuctionInstance.bidBySelf(currentslot,url,{from: accounts[0],value:minbid});
		} catch(e) {
			assert(e.message.includes('This auction is already closed'));
			return;
		}
		assert(false);
	});
	
	it('should not bid on one slot ahead of current slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		try{
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplusone = currentslot.toNumber() + 1;
		await burnAuctionInstance.bidBySelf(currentslotplusone,url,{from: accounts[0],value:minbid});
		} catch(e) {
			assert(e.message.includes('This auction is already closed'));
			return;
		}
		assert(false);
	});

	it('should bid sucessfully on first auction slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let currentslot = await burnAuctionInstance.currentSlot.call();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let tx = await burnAuctionInstance.bidBySelf(currentslotplustwo,url,{from: accounts[0],value:minbid});
		//console.log(tx);
		let bid = await burnAuctionInstance.slotBid.call(currentslotplustwo);
		//console.log((bid[0]).toNumber());
		//console.log(bid[1]);
		// todo check returns
		truffleAssert.eventEmitted(tx,'currentBestBid');
		// check slot bidding succesfull or not
		assert( bid[1] === true );
		// check correct bid amount for valid bid
		assert( (bid[0]).toNumber() === minbid );
		
	});
	
	it('should bid sucessfully on one slot ahead of auction slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplusthree = currentslot.toNumber() + 3;
		let tx = await burnAuctionInstance.bidBySelf(currentslotplusthree,url,{from: accounts[0],value:minbid});
		let bid = await burnAuctionInstance.slotBid(currentslotplusthree);
		truffleAssert.eventEmitted(tx,'currentBestBid');
		assert( bid[1] === true );
		assert( (bid[0]).toNumber() === minbid );
	});
	
	it('should bid sucessfully on random n slot ahead of first auction slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let randomNo = randNo(4,10);
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplusrandom = currentslot.toNumber() + randomNo;
		let tx = await burnAuctionInstance.bidBySelf(currentslotplusrandom,url,{from: accounts[0],value:minbid});
		let bid = await burnAuctionInstance.slotBid(currentslotplusrandom);
		truffleAssert.eventEmitted(tx,'currentBestBid');
		assert( bid[1] === true );
		assert( (bid[0]).toNumber() === minbid );
	});
	
	
	it('should overbid succesfully by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		// get previous bidamount first 
		let previousbid = await burnAuctionInstance.slotBid(currentslotplustwo);
        let prevbidamount = (previousbid[0]).toNumber();
        //console.log(prevbidamount);		
		let nextbidamount = prevbidamount + ((prevbidamount*minnextbid)/100);
		//console.log(nextbidamount);
		// outbid by account 1 for self as it has bid by account0 in previous tests
		let tx1 = await burnAuctionInstance.bidBySelf(currentslotplustwo,url,{from: accounts[1],value:nextbidamount});
		let bid = await burnAuctionInstance.slotBid(currentslotplustwo);
		let winner = await burnAuctionInstance.slotWinner(currentslotplustwo);
		// check winner as account 1
		let checkwinneraddr = (winner[0]).toString();
		assert( checkwinneraddr === accounts[1] );
		// check auction stays in active stage
		assert( bid[1] === true );
		// check auctioned slot amount changed as over bid amount
		assert( (bid[0]).toNumber() === nextbidamount );
	});
	
	
	// only for gas reports move to hubbletest,burnerauction.spec 
	it('should return correct winner for first auction slot', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let winner = await burnAuctionInstance.getCurrentWinner();
		let subaddress = (winner[0]).toString();
		//console.log((winner[0]).toString());
		assert( subaddress = accounts[1] );
     });
		
	// checkwinnerss using checkwinner and getwinner fr self
	// slots for others functionality from 12-20
	it('should not bid on current slot for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		try{
		let currentslot = await burnAuctionInstance.currentSlot();
		//console.log(currentslot.toNumber());
		await burnAuctionInstance.bidForOthers(currentslot,returnaddr,subaddr,url,{from: accounts[0],value:minbid});
		} catch(e) {
			assert(e.message.includes('This auction is already closed'));
			return;
		}
		assert(false);
	});
	
	it('should not bid on one slot ahead of current slot for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		try{
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplusone = currentslot.toNumber() + 1;
		await burnAuctionInstance.bidForOthers(currentslot,returnaddr,subaddr,url,{from: accounts[0],value:minbid});
		} catch(e) {
			assert(e.message.includes('This auction is already closed'));
			return;
		}
		assert(false);
	});
	
	it('should bid sucessfully on first auction slot for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		let currentslot = await burnAuctionInstance.currentSlot();
		// ideally skipslots and then test 
		// update once skipblock issue is solved
		let currentslotplustwo = currentslot.toNumber() + 12;
		let tx = await burnAuctionInstance.bidForOthers(currentslotplustwo,returnaddr,subaddr,url,{from: accounts[0],value:minbid});
		let bid = await burnAuctionInstance.slotBid(currentslotplustwo);
		truffleAssert.eventEmitted(tx,'currentBestBid');
		assert( bid[1] === true );
		assert( (bid[0]).toNumber() === minbid );
	});
	
	it('should bid sucessfully on one slot ahead of auction slot for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplusthree = currentslot.toNumber() + 13;
		let tx = await burnAuctionInstance.bidForOthers(currentslotplusthree,returnaddr,subaddr,url,{from: accounts[0],value:minbid});
		let bid = await burnAuctionInstance.slotBid(currentslotplusthree);
		truffleAssert.eventEmitted(tx,'currentBestBid');
		assert( bid[1] === true );
		assert( (bid[0]).toNumber() === minbid );
	});
	
	it('should bid sucessfully on random n slot ahead of auction for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		let currentslot = await burnAuctionInstance.currentSlot();
		let randomNo = randNo(14,20);
		let currentslotplusrandom = currentslot.toNumber() + randomNo;
		let tx = await burnAuctionInstance.bidForOthers(currentslotplusrandom,returnaddr,subaddr,url,{from: accounts[0],value:minbid});
		let bid = await burnAuctionInstance.slotBid(currentslotplusrandom);
		truffleAssert.eventEmitted(tx,'currentBestBid');
		assert( bid[1] === true );
		assert( (bid[0]).toNumber() === minbid );
	});
	
    /*	
	it('should overbid succesfully for others on first auction slot', async function() {
		
	});
    */
    // slots for testing different amount bid cases functionality from 
	/*
	it('should not bid with ether less than minbid for self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let bidamount = minbid - 1;
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		try {
		await burnAuctionInstance.bidBySelf(currentslotplustwo,url,{from: accounts[0],value:bidamount});
		} catch(e) {
			assert(e.message.includes('bid not enough than minimum bid'));
			return;
		}
		assert(false);
	});
	*/
	/*
	it('should bid succesfully with ether equal to minbid for self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let bidamount = minbid + 0;
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let result = await burnAuctionInstance.bidBySelf.call(currentslotplustwo,url,{from: accounts[0],value:bidamount});
		assert(result === true);
	});
	
	it('should bid succesfully with ether more than minbid for self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let bidamount = minbid + 1;
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let result = await burnAuctionInstance.bidBySelf.call(currentslotplustwo,url,{from: accounts[0],value:bidamount});
		assert(result == true);
	});
	*/
	/*
	it('should not bid with ether less than minbid for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let bidamount = minbid - 1;
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		try {
		await burnAuctionInstance.bidForOthers(currentslotplustwo,returnaddr,subaddr,url,{from: accounts[0],value:bidamount});
		} catch(e) {
			assert(e.message.includes('bid not enough than minimum bid'));
			return;
		}
		assert(false);
	});
	
	it('should skip a block', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		
		let curb = await burnAuctionInstance.getBlockNumber();
		console.log(curb.toNumber());
		let cur = curb + 1;
		advance.advanceToBlock(cur);
		let curb2 = await burnAuctionInstance.getBlockNumber();
		console.log(curb2.toNumber());
	});
	*/
	/*
	it('should bid succesfully with ether equal minbid for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let bidamount = minbid + 0;
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		let result = await burnAuctionInstance.bidForOthers(currentslotplustwo,returnaddr,subaddr,url,{from: accounts[0],value:bidamount});
		assert(result === true);
	});
	
	it('should bid succesfully with ether more than minbid for others', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let bidamount = minbid + 1;
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let returnaddr = accounts[1];
		let subaddr = accounts[2];
		let result = await burnAuctionInstance.bidForOthers(currentslotplustwo,returnaddr,subaddr,url,{from: accounts[0],value:bidamount});
		assert(result === true);
	});
		
	*/
	
	// tests for getwinner
	// first bid
		//let result = await burnAuctionInstance.bidBySelf.call(currentslotplustwo,url,{from: accounts[0],value:minbid});
		//assert(result === true);
		// getWinner
		// check winner also

	 function randNo(min:any , max:number) {
		 let randN= Math.random() * (max - min) + min ;
		 return Math.round(randN);
	 }	
	 
});

contract("HubbleTest", async function(accounts) {
    
	let hubbleTestInstance:any;
	let burnAuctionInstance:any;
	const minbid: number = 10000000000;
	const url: string = "hellocord.com";
	
	before(async function() {
		
		hubbleTestInstance = await HubbleTest.deployed();	
		burnAuctionInstance = await BurnAuction.deployed();
		});
		
		it('should deploy the hubbleTest Contract', async function() {
		assert(hubbleTestInstance.address !== '');
	    });
		
		it('should call submit batch', async function() {
		let slot = await burnAuctionInstance.currentSlot();
		console.log(slot);
		/*
		let slottoBid = slot.toNumber() + 2;
		let bid = await burnAuctionInstance.bidBySelf(slottoBid,url,{from: accounts[0],value:minbid});	
		skip two slots
		let tx = await hubbleTestInstance.submitBatch.sendTransaction({from:accounts[0]});
		console.log(tx);
		const gasCost = tx.gasPrice.mul(tx.receipt.gasUsed);
		console.log(gasCost);
		*/
	    });
	
});