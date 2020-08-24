import * as chai from "chai";
import { ethers } from "ethers";
const truffleAssert = require("truffle-assertions");
const BurnAuction = artifacts.require("BurnAuction");
import { BurnAuctionContract } from "../types/truffle-contracts/index";

//local ganache url
let url = "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(url);
//console.log(provider);

//contract tests
contract("BurnAuction", async function(accounts) {
	
	let burnAuctionInstance: any;
	let CoordinatorA: any;
	let CoordinatorB: any;
	let CoordinatorC: any;
	let blocknumber: number;
	//const delay:number = 100;
	
	before(async function() {
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
	
	//complete after logic updates
	/*
	it('should ', async function() {
		burnAuctionInstance = await BurnAuction.deployed();		
		assert();
	});
	
	it('should ', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		assert();
	});
	
	it('should ', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		assert();
	});
	*/
	
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
		console.log(valueToCompare);
		console.log(result.toNumber());
		assert( result.toNumber() === valueToCompare );
	});
	
});