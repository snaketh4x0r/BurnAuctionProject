import * as chai from "chai";
import { ethers } from "ethers";
import { BurnAuctionContract } from "../types/truffle-contracts/index";
//import * as walletHelper from "../scripts/helpers/wallet";
const truffleAssert = require("truffle-assertions");
const advance = require("truffle-test-helpers");
const BurnAuction = artifacts.require("BurnAuction");

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
    	
	
	before(async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		});
	
   	
	it('should check the BurnAuction Contract deployed or not', async function() {
		//console.log(burnAuctionInstance.address);
		assert(burnAuctionInstance.address !== '');
	});
		
	// functional tests
	/*
	it("Make winning Bid by self for Slot 2",async function){
		//make bid for slot 12 using minbid
		// make bid by coordinayor a
		let currentslot = await burnAuctionInstance.currentSlot();
		let currentslotplustwo = currentslot.toNumber() + 2;
		let tx1 = await burnAuctionInstance.bidBySelf(currentslotplustwo,url,{from: accounts[0],value:minbid});
		let bid1 = await burnAuctionInstance.slotBid(currentslotplustwo);
		// checks forr bid by coordinator a successful or not
		truffleAssert.eventEmitted(tx,'currentBestBid');
		assert( bid1[1] === true );
		assert( (bid1[0]).toNumber() === minbid );
		// check chnage in balances of a and burnaddress balance
		
		// now skip few blocks then overbid to test real world scenario on same slot
		// overbid by coordinayor b
		let tx2 = await burnAuctionInstance.bidBySelf(currentslotplustwo,url,{from: accounts[0],value:minbid});
		let bid2 = await burnAuctionInstance.slotBid(currentslotplustwo);
		ssert( bid2[1] === true );
		assert( (bid2[0]).toNumber() === minbid );
		// check balance returned to a
		// check chnage in balances of b and burnaddress balance
		
		// check correct amount burned after this
		
	}
	
	it("Make winning Bid for others for slot 3",async function){
		//make bid for slot 2 using minbid
		// make bid by coordinayor a for c
		// overbid by coordinayor b for d
		// check balance returned to a
		// check burnbid as amt by b
		// check smart contract balance,b
	}
		
	// check slots after this to match winners
	// check for default co address on slots with no bids	 
	*/
});