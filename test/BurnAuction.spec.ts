import * as chai from "chai";
import {ethers} from "ethers";
import {BurnAuctionContract} from "../types/truffle-contracts/index";
//import * as walletHelper from "../scripts/helpers/wallet";
const truffleAssert = require("truffle-assertions");
const advance = require("truffle-test-helpers");
const BurnAuction = artifacts.require("BurnAuction");

let accounts = web3.eth.getAccounts();

contract("BurnAuction", async function(accounts) {
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
  const burnaddr: string = "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4";
  const coadd: string = "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4";
  //const delay:number = 100;

  // flow
  // first bid using CoordinatorA for slot 3
  // next overbid using CoordinatorB for slot 3
  // now
  // first bid using CoordinatorC for slot 4
  // next overbid using CoordinatorD for slot 4
  // both above process occur in slot 0 next skip two slots
  // check default coordinator address as winner for slot 2
  // slot 2 has no bids

  before(async function() {
    burnAuctionInstance = await BurnAuction.deployed();
  });

  it("should check the BurnAuction Contract deployed or not", async function() {
    //console.log(burnAuctionInstance.address);
    assert(burnAuctionInstance.address !== "");
  });

  // functional tests

  it("Make winning Bid by self for Slot 3", async function() {
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = 3;
    // initial bid
    let initialbal = await getbalance(burnaddr);
    // make bid by coordinator a on first auction slot available
    let tx1 = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[1],
      value: minbid
    });
    let bid1 = await burnAuctionInstance.slotBid(slottoBid);
    // checks for bid by coordinator a successful or not
    truffleAssert.eventEmitted(tx1, "currentBestBid");
    // check tx1 succesful
    let tx1status = tx1.receipt.status;
    assert(tx1status === true);
    // check auction initialized
    assert(bid1[1] === true);
    // bidamount bidded is same as minbid sent
    assert(bid1[0].toNumber() === minbid);
    // check coordinator A is winner for slot currently
    let initialwinner = await burnAuctionInstance.checkWinner(
      slottoBid,
      accounts[1]
    );
    assert(initialwinner == true);
    // check amount burnt succesfully
    let balafterfirsttx = await getbalance(burnaddr);
    let amountburned = balafterfirsttx - initialbal;
    assert(amountburned === minbid);
    // calculate overbid amount
    let previousbid = await burnAuctionInstance.slotBid(slottoBid);
    let prevbidamount = previousbid[0].toNumber();
    let nextbidamount = prevbidamount + (prevbidamount * minnextbid) / 100;
    // overbid by coordinator b
    let tx2 = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[2],
      value: nextbidamount
    });
    // check tx2 succesful
    let tx2status = tx2.receipt.status;
    assert(tx2status === true);
    truffleAssert.eventEmitted(tx2, "currentBestBid");
    // check amount burnt succesfully
    let balaftersecondtx = await getbalance(burnaddr);
    let amountburnedoverbid = balaftersecondtx - balafterfirsttx;
    let diffamount = nextbidamount - minbid;
    assert(amountburnedoverbid === diffamount);
    let bid2 = await burnAuctionInstance.slotBid(slottoBid);
    // check if auction stays initialized
    assert(bid2[1] === true);
    // check if bid amount for bidding slot changed to new bid amount
    assert(bid2[0].toNumber() === nextbidamount);
    // check if slot winner updated correctly
    let overbidwinner = await burnAuctionInstance.checkWinner(
      slottoBid,
      accounts[2]
    );
    assert(overbidwinner == true);
  });

  it("Make winning Bid for others for slot 4", async function() {
    let slottoBid = 4;
    let subaddrC1 = accounts[3];
    let subaddrC2 = accounts[4];
    let initialbal = await getbalance(burnaddr);
    let tx1 = await burnAuctionInstance.bidForOthers(slottoBid, subaddrC1, {
      from: accounts[3],
      value: minbid
    });
    let bid1 = await burnAuctionInstance.slotBid(slottoBid);
    // check tx1 succesful
    let tx1status = tx1.receipt.status;
    assert(tx1status === true);
    // check amount burnt succesfully
    let balafterfirsttx = await getbalance(burnaddr);
    let amountburned = balafterfirsttx - initialbal;
    assert(amountburned === minbid);
    // checks for bid by coordinator c successful or not
    truffleAssert.eventEmitted(tx1, "currentBestBid");
    // check auction initialized
    assert(bid1[1] === true);
    // bidamount bidded is same as minbid sent
    assert(bid1[0].toNumber() === minbid);
    // check coordinator C is winner for slot currently
    let initialwinner = await burnAuctionInstance.checkWinner(
      slottoBid,
      accounts[3]
    );
    assert(initialwinner == true);
    // calculate overbid amount
    let previousbid = await burnAuctionInstance.slotBid(slottoBid);
    let prevbidamount = previousbid[0].toNumber();
    let nextbidamount = prevbidamount + (prevbidamount * minnextbid) / 100;
    // overbid by coordinator d
    let tx2 = await burnAuctionInstance.bidForOthers(slottoBid, subaddrC2, {
      from: accounts[4],
      value: nextbidamount
    });
    let bid2 = await burnAuctionInstance.slotBid(slottoBid);
    // check tx successful
    let tx2status = tx2.receipt.status;
    assert(tx2status === true);
    truffleAssert.eventEmitted(tx2, "currentBestBid");
    // check auction stays initialized
    assert(bid2[1] === true);
    // bidamount bidded is same as nextbidamount sent
    assert(bid2[0].toNumber() === nextbidamount);
    // check amount burnt succesfully
    let balaftersecondtx = await getbalance(burnaddr);
    let amountburnedoverbid = balaftersecondtx - balafterfirsttx;
    let diffamount = nextbidamount - minbid;
    assert(amountburnedoverbid === diffamount);
  });

  // use get winner to check winner
  it("verify winners for current slot correctly", async function() {
    // getcurrentwinner
    skipslot();
    skipslot();
    let winner;
    let currentslot = await burnAuctionInstance.currentSlot();
    let queriedaddress = await burnAuctionInstance.getCurrentWinner();
    let slotwinner = await burnAuctionInstance.slotWinner(currentslot);
    if (slotwinner == "0x0000000000000000000000000000000000000000") {
      winner = coadd;
      assert(queriedaddress == winner);
    }
  });

  // helpers

  function getbalance(address: string) {
    let bal = web3.eth.getBalance(address);
    return bal;
  }

  function skipblocks(currentblock: number, block: number) {
    let blocktoskip = currentblock + block;
    advance.advanceToBlock(blocktoskip);
  }

  function skipnblocks(block: number) {
    for (let i = 0; i <= block; i++) {
      advance.advanceBlock();
    }
  }

  function skipslot() {
    let block = blocksperslot;
    for (let i = 0; i <= block; i++) {
      advance.advanceBlock();
    }
  }

  function skiptoauctionslot() {
    let block = blocksperslot + 40;
    for (let i = 0; i <= block; i++) {
      advance.advanceBlock();
    }
  }
});
