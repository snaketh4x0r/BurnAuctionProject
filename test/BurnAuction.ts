import * as chai from "chai";
import { ethers } from "ethers";
const truffleAssert = require("truffle-assertions");
const BurnAuction = artifacts.require("BurnAuction");

//local ganache url
let url = "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(url);
//console.log(provider);

contract("BurnAuction", async function(accounts) {
	
	let burnAuctionInstance: any;
	let CoordinatorA: any;
	let CoordinatorB: any;
	let CoordinatorC: any;
	let blocknumber: number;
	//let delay:number = 100;
	//let genesisBlock:number;
	
	before(async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		//let initBlock = await provider.getBlockNumber();
		//genesisBlock = initBlock + delay;
		//console.log(genesisBlock);
		});
		
	it('should deploy the BurnAuction Contract', async function() {
		//console.log(burnAuctionInstance.address);
		burnAuctionInstance = await BurnAuction.deployed();
		assert(burnAuctionInstance.address !== '');
	});
	
	it('should get slot id from blocknumber input', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		blocknumber = await provider.getBlockNumber();
		console.log(blocknumber);
	});
	
	it('should get slot id from blocknumber input', async function() {
		burnAuctionInstance = await BurnAuction.deployed();
		const currentblock = await burnAuctionInstance.getBlockNumber();
		const genesisblock = await burnAuctionInstance.genesisBlock();
		console.log(currentblock.toNumber());
		console.log(genesisblock.toNumber());
	});
	
	it('should get current blocknumber', async function() {
        burnAuctionInstance = await BurnAuction.deployed();		
	    //const currentblock = await burnAuctionInstance.getBlockNumber();
		//const genesisblock = await burnAuctionInstance.genesisBlock();
		//console.log(currentblock.toNumber());
		//console.log(genesisblock.toNumber());
		blocknumber = await provider.getBlockNumber();
		//blocknumber = ethers.utils.bigNumberify(blocknumber);
		const result = await burnAuctionInstance.getBlockNumber();
		//console.log(blocknumber);
		//console.log(result);
		//console.log(result.toString());
		assert(result.toNumber() === blocknumber);
	});
	
		
	
	
});