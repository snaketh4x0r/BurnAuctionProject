import * as chai from "chai";
import { ethers } from "ethers";
import { BurnAuctionContract } from "../types/truffle-contracts/index";
import * as walletHelper from "../scripts/helpers/wallet";
const truffleAssert = require("truffle-assertions");
const BurnAuction = artifacts.require("BurnAuction");
//local ganache url
let url = "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(url);
//console.log(provider);

contract("BurnAuction", async function(accounts) {
	
	let burnAuctionInstance: any;
	let wallets: any;
	let CoordinatorA: any;
	let CoordinatorB: any;
	let CoordinatorC: any;
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
		wallets = walletHelper.generateFirstWallets(walletHelper.mnemonics, 10);
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
	
	// test initially for one auction condition then expand between multiple bidders
	
	
	it('should bid unsucessfully on slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let auctionslot = getCurrentslot(burnAuctionInstance) + 2;
		let result = bidBySelf(burnAuctionInstance,wallets[0].getAddressString(),auctionslot,url,minbid);
		assert(result === true);
	});
	
	it('should bid sucessfully on slot by self', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let result = bidBySelf(burnAuctionInstance,wallets[0].getAddressString(),getCurrentslot(burnAuctionInstance),url,minbid);
		assert(result === true);
	});
	
	/*
	it('should fail bidding on slot next to current slot', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		assert();
	});
	
	it('should bid succesfully on two slots ahead of current slot', async function() {
		burnAuctionInstance = await BurnAuction.deployed();		
		assert();
	});
		
	it('should bid three slots ahead', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		assert();
	});
	
	// add more
	
	// multiple bidders
	it('should outbid previous bidder succesfully two slots ahead of current slot', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		assert();
	});
	
	// add more
	
	*/
	
	//todo move unit tests to solidity
	// tests in sol lol
	it('should get current blocknumber', async function() {	
	    burnAuctionInstance = await BurnAuction.deployed();
	    //const currentblock = await burnAuctionInstance.getBlockNumber();
		//const genesisblock = await burnAuctionInstance.genesisBlock();
		//console.log(currentblock.toNumber());
		//console.log(genesisblock.toNumber());
		blocknumber = await provider.getBlockNumber();
		//blocknumber = ethers.utils.bigNumberify(blocknumber);
		let result = await burnAuctionInstance.getBlockNumber();
		//console.log(blocknumber);
		//console.log(result);
		//console.log(result.toString());
		assert(result.toNumber() === blocknumber);
	});
	
	it('should get current slot number', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		burnAuctionInstance = await BurnAuction.deployed();
		let tempGen = await burnAuctionInstance.genesisBlock();
		let genesisblock = tempGen.toNumber();
		let blocksperslot = await  burnAuctionInstance.blocksPerSlot();
		let currentblock = await burnAuctionInstance.getBlockNumber();
		currentblock = currentblock.toNumber();
		//for weird truffle block differance
		//currentblock = currentblock - 6;
		console.log(currentblock);
		let valueToCompare = (currentblock - genesisblock)/blocksperslot.toNumber();
		let result = await burnAuctionInstance.currentSlot();
		//console.log(result.toNumber());
		//console.log(valueToCompare);
		assert( result.toNumber() === valueToCompare );
	});
	
	it('should get slot id from blocknumber', async function() {
		//currentblock taken as argument for block number
		burnAuctionInstance = await BurnAuction.deployed();
		let tempGen = await burnAuctionInstance.genesisBlock();
		let genesisblock = tempGen.toNumber();
		let blocksperslot = await  burnAuctionInstance.blocksPerSlot();
		let currentblock = await burnAuctionInstance.getBlockNumber();
		currentblock = currentblock.toNumber();
		//for weird truffle block differance
		//currentblock = currentblock - 6;
		let valueToCompare = (currentblock - genesisblock)/blocksperslot.toNumber();
		let result = await burnAuctionInstance.block2slot(currentblock);
		//console.log(result.toNumber());
		//console.log(valueToCompare);
		assert( result.toNumber() === valueToCompare );
	});
	
	it('should get first blocknumber for given slot', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		let genesisblock = await burnAuctionInstance.genesisBlock();
		let blocksperslot = await  burnAuctionInstance.blocksPerSlot();
		let currentslot = await burnAuctionInstance.currentSlot();
		let result = burnAuctionInstance.getBlockBySlot(currentslot);
		let valueToCompare = currentslot.toNumber() * blocksperslot.toNumber() + genesisblock.toNumber();
		//console.log(valueToCompare);
		//console.log(result.toNumber());
		assert( result.toNumber() === valueToCompare );
	});
	
	// helpers
	 async function bidBySelf(_burnAuctionInstance:any,address: string,_slot: number,url:string,bidprice: number) {
			 let result = await _burnAuctionInstance.bidBySelf(
				 _slot,
				 url,
				 { 
				 from:address,
				 value:bidprice  
		   });
		   return result;		  
	 };
	 
	 async function bidForOthers(_burnAuctionInstance:any,address: string,_slot: number,url:string,bidprice: number,submitaddress:string,returnadress:string) {
		 
	 let result = await _burnAuctionInstance.bidForOthers(
				 _slot,
				 returnadress,
				 submitaddress,
				 url,
				 { 
				 from:address,
				 value:bidprice  
		 });
		   return result;		  
	 };
		
	 async function getBalance(address:string) {
		 let bal = web3.eth.getBalance(address);
		 return bal;
	 }
	 
	 async function getCurrentslot(_burnAuctionInstance:any) {
		 let result = _burnAuctionInstance.currentslot();
		 return result;
	 }
	 
	 
		
		
	
});