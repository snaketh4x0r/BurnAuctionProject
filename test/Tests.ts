import * as chai from "chai";
import {ethers} from "ethers";
import {BurnAuctionContract} from "../types/truffle-contracts/index";
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
  const blocksperslot: number = 40;
  const maxtx: number = 100;
  const minbid: number = 10000000000;
  const minnextslot: number = 2;
  const minnextbid: number = 30;
  const delay: number = 0;
  const url: string = "hellocord.com";
  //const delay:number = 100;

  before(async function() {
    //wallets = walletHelper.generateFirstWallets(walletHelper.mnemonics, 10);
    burnAuctionInstance = await BurnAuction.deployed();
    //let tempGen = await burnAuctionInstance.genesisBlock();
    //genesisblock = tempGen.toNumber();
    //let initBlock = await provider.getBlockNumber();
    //genesisBlock = initBlock + delay;
    //console.log(genesisBlock);
  });

  it("should check BurnAuction Contract deployed", async function() {
    //console.log(burnAuctionInstance.address);
    assert(burnAuctionInstance.address !== "");
  });

  // slots for self functionality from 2-10
  it("should not bid on current slot by self", async function() {
    try {
      let currentslot = await burnAuctionInstance.currentSlot();
      await burnAuctionInstance.bidBySelf(currentslot, {
        from: accounts[0],
        value: minbid
      });
    } catch (e) {
      assert(e.message.includes("This auction is already closed"));
      return;
    }
    assert(false);
  });

  it("should not bid on one slot ahead of current slot by self", async function() {
    try {
      let currentslot = await burnAuctionInstance.currentSlot();
      let slottoBid = currentslot.toNumber() + 1;
      await burnAuctionInstance.bidBySelf(slottoBid, {
        from: accounts[0],
        value: minbid
      });
    } catch (e) {
      assert(e.message.includes("This auction is already closed"));
      return;
    }
    assert(false);
  });

  it("should bid sucessfully on first auction slot by self", async function() {
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 2;
    let tx = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[0],
      value: minbid
    });
    //console.log(tx);
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    //console.log((bid[0]).toNumber());
    //console.log(bid[1]);
    // todo check returns
    truffleAssert.eventEmitted(tx, "currentBestBid");
    // check slot bidding succesfull or not
    assert(bid[1] === true);
    // check correct bid amount for valid bid
    assert(bid[0].toNumber() === minbid);
  });

  it("should bid sucessfully on one slot ahead of auction slot by self", async function() {
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 3;
    let tx = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[0],
      value: minbid
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === minbid);
  });

  it("should bid sucessfully on random n slot ahead of first auction slot by self", async function() {
    let randomNo = randNo(4, 10);
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + randomNo;
    let tx = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[0],
      value: minbid
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === minbid);
  });

  it("should overbid succesfully by self", async function() {
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 2;
    // get previous bidamount first
    let previousbid = await burnAuctionInstance.slotBid(slottoBid);
    let prevbidamount = previousbid[0].toNumber();
    //console.log(prevbidamount);
    let nextbidamount = prevbidamount + (prevbidamount * minnextbid) / 100;
    //console.log(nextbidamount);
    // outbid by account 1 for self as it has bid by account0 in previous tests
    let tx1 = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[1],
      value: nextbidamount
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    let winner = await burnAuctionInstance.slotWinner(slottoBid);
    //console.log(winner);
    // no need for this as Coordinator struct only has one address now
    //let checkwinneraddr = (winner[0]);
    //console.log(checkwinneraddr);
    // check overbidder as successful bid winner
    // check winner as account 1
    assert(winner === accounts[1]);
    // check auction stays in active stage
    assert(bid[1] === true);
    // check auctioned slot amount changed as over bid amount
    assert(bid[0].toNumber() === nextbidamount);
  });

  // checkwinnerss using checkwinner and getwinner fr self
  // slots for others functionality from 12-20
  it("should not bid on current slot for others", async function() {
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    try {
      let currentslot = await burnAuctionInstance.currentSlot();
      //console.log(currentslot.toNumber());
      await burnAuctionInstance.bidForOthers(currentslot, subaddr, {
        from: accounts[0],
        value: minbid
      });
    } catch (e) {
      assert(e.message.includes("This auction is already closed"));
      return;
    }
    assert(false);
  });

  it("should not bid on one slot ahead of current slot for others", async function() {
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    try {
      let currentslot = await burnAuctionInstance.currentSlot();
      let slottoBid = currentslot.toNumber() + 1;
      await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
        from: accounts[0],
        value: minbid
      });
    } catch (e) {
      assert(e.message.includes("This auction is already closed"));
      return;
    }
    assert(false);
  });

  it("should bid sucessfully on first auction slot for others", async function() {
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    let currentslot = await burnAuctionInstance.currentSlot();
    // ideally skipslots and then test
    // update once skipblock issue is solved
    let slottoBid = currentslot.toNumber() + 12;
    let tx = await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
      from: accounts[0],
      value: minbid
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === minbid);
  });

  it("should bid sucessfully on one slot ahead of auction slot for others", async function() {
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 13;
    let tx = await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
      from: accounts[0],
      value: minbid
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === minbid);
  });

  it("should bid sucessfully on random n slot ahead of auction for others", async function() {
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    let currentslot = await burnAuctionInstance.currentSlot();
    let randomNo = randNo(14, 20);
    let slottoBid = currentslot.toNumber() + randomNo;
    let tx = await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
      from: accounts[0],
      value: minbid
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === minbid);
  });

  it("should overbid succesfully for others on first auction slot", async function() {
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 12;
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    let previousbid = await burnAuctionInstance.slotBid(slottoBid);
    let prevbidamount = previousbid[0].toNumber();
    let nextbidamount = prevbidamount + (prevbidamount * minnextbid) / 100;
    let tx = await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
      from: accounts[1],
      value: nextbidamount
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    let winner = await burnAuctionInstance.slotWinner(slottoBid);
    let checkwinneraddr = winner[0].toString();
    // accounts[1] bids for accounts[2]
    // so check accounts[2] as winner
    assert(winner === accounts[2]);
    assert(bid[1] === true);
    assert(bid[0].toNumber() === nextbidamount);
  });

  // slots for testing different amount bid cases from 22-25
  it("should not bid with ether less than minbid for self", async function() {
    let bidamount = minbid - 1;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 22;
    try {
      await burnAuctionInstance.bidBySelf(slottoBid, {
        from: accounts[0],
        value: bidamount
      });
    } catch (e) {
      assert(e.message.includes("bid not enough than minimum bid"));
      return;
    }
    assert(false);
  });

  it("should bid succesfully with ether equal to minbid for self", async function() {
    let bidamount = minbid + 0;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 22;
    let tx = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[0],
      value: bidamount
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === minbid);
  });

  it("should not overbid with ether less than current max bid for self", async function() {
    let bidamount = minbid + 0;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 22;
    try {
      await burnAuctionInstance.bidBySelf(slottoBid, {
        from: accounts[0],
        value: bidamount
      });
    } catch (e) {
      assert(e.message.includes("bid not enough to outbid current bidder"));
      return;
    }
    assert(false);
  });

  it("should bid succesfully with ether more than minbid for self", async function() {
    let bidamount = minbid + 1;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 23;
    let tx = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[0],
      value: bidamount
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === bidamount);
  });

  it("should not bid with ether less than minbid for others", async function() {
    let bidamount = minbid - 1;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 24;
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    try {
      await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
        from: accounts[0],
        value: bidamount
      });
    } catch (e) {
      assert(e.message.includes("bid not enough than minimum bid"));
      return;
    }
    assert(false);
  });

  it("should bid succesfully with ether equal minbid for others", async function() {
    let bidamount = minbid + 0;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 24;
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    let tx = await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
      from: accounts[0],
      value: bidamount
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === bidamount);
  });

  it("should not overbid with ether less than current max bid for others", async function() {
    let bidamount = minbid + 0;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 24;
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    try {
      await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
        from: accounts[0],
        value: bidamount
      });
    } catch (e) {
      assert(e.message.includes("bid not enough to outbid current bidder"));
      return;
    }
    assert(false);
  });

  it("should bid succesfully with ether more than minbid for others", async function() {
    let bidamount = minbid + 1;
    let currentslot = await burnAuctionInstance.currentSlot();
    let slottoBid = currentslot.toNumber() + 25;
    let returnaddr = accounts[1];
    let subaddr = accounts[2];
    let tx = await burnAuctionInstance.bidForOthers(slottoBid, subaddr, {
      from: accounts[0],
      value: bidamount
    });
    let bid = await burnAuctionInstance.slotBid(slottoBid);
    truffleAssert.eventEmitted(tx, "currentBestBid");
    assert(bid[1] === true);
    assert(bid[0].toNumber() === bidamount);
  });

  it("should return 0 if numblock less than genesisblock", async function() {
    let genesisblock = await burnAuctionInstance.genesisBlock();
    let numblock = genesisblock.toNumber() - 1;
    let result = await burnAuctionInstance.block2slot.call(numblock);
    assert(result.toNumber() === 0);
  });

  /* for testing skipblocks	
	it('should skip a block', async function() {
		let curb = await burnAuctionInstance.getBlockNumber();
		console.log(curb.toNumber());
		let cur = curb + 1;
		advance.advanceBlock();
		let curb2 = await burnAuctionInstance.getBlockNumber();
		console.log(curb2.toNumber());
	});	
    
  // tests for getwinner
  // first bid
  //let result = await burnAuctionInstance.bidBySelf.call(currentslotplustwo,url,{from: accounts[0],value:minbid});
  //assert(result === true);
  // getWinner
  // check winner also
*/
  function randNo(min: any, max: number) {
    let randN = Math.random() * (max - min) + min;
    return Math.round(randN);
  }
});

contract("HubbleTest", async function(accounts) {
  let hubbleTestInstance: any;
  let burnAuctionInstance: any;
  const minbid: number = 10000000000;
  const blocksperslot: number = 40;
  const url: string = "hellocord.com";

  before(async function() {
    hubbleTestInstance = await HubbleTest.deployed();
    burnAuctionInstance = await BurnAuction.deployed();
  });

  it("should deploy the hubbleTest Contract", async function() {
    assert(hubbleTestInstance.address !== "");
  });

  it("should call submit batch", async function() {
    let slotfi = await burnAuctionInstance.currentSlot();
    //console.log(slotfi.toNumber());
    let currentB = slotfi.toNumber();
    // first bid
    let slottoBid = currentB + 2;
    let bid = await burnAuctionInstance.bidBySelf(slottoBid, {
      from: accounts[0],
      value: minbid
    });
    // then skip to slot won
    skiptoauctionslot();
    let slotne = await burnAuctionInstance.currentSlot();
    //console.log(slotne.toNumber());
    // make submit batch tx
    let tx = await hubbleTestInstance.submitBatch({
      from: accounts[0]
    });
    //console.log(tx);
    let txreceipt = tx.receipt;
    const gasCost = tx.receipt.gasUsed;
    //console.log(gasCost);
    let txstatus = tx.receipt.status;
    //console.log(txstatus);
    assert(txstatus === true);
  });

  it("should fail on submit batch by wrong account", async function() {
    try {
      let slotfi = await burnAuctionInstance.currentSlot();
      //console.log(slotfi.toNumber());
      let currentB = slotfi.toNumber();
      // first bid
      let slottoBid = currentB + 2;
      // bid using account 0
      let bid = await burnAuctionInstance.bidBySelf(slottoBid, {
        from: accounts[0],
        value: minbid
      });
      // then skip to slot won
      skiptoauctionslot();
      let slotne = await burnAuctionInstance.currentSlot();
      //console.log(slotne.toNumber());
      // make submit batch tx using account 1
      let tx = await hubbleTestInstance.submitBatch({
        from: accounts[1]
      });
      //console.log(tx);
      let txreceipt = tx.receipt;
      const gasCost = tx.receipt.gasUsed;
      //console.log(gasCost);
      let txstatus = tx.receipt.status;
      //console.log(txstatus);
    } catch (e) {
      assert(e.message.includes("Coordinator didn't won slot"));
      return;
    }
    assert(false);
  });

  // helpers
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
