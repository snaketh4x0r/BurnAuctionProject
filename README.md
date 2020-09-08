# :fire:Burn Auction Project

## Introduction 

In a bunch of different contexts we want to select who is allowed to create a block.

Currently we have a compeition (pow, pos) to decide who is allowed to create a block. This is to rate limit the blocks that a node needs to check.
Provide a level of censorship resistance by randomly selecting this block creator so that censorship efforts need to involve a large percentage of the network to prevent a transaction from being minded for a long time.
These schemes are wasteful in that they require a large amount of stake to be deposited or work to be done.

Both are costs that need to be reimbursed via fees. It creates this monopoly where a single person is created for creation of block x and they are insentivized to extract as much funds as possible in the form of transaction fees.

Here we propose a method to auction the right to create a new block to the person willing to burn the most eth. This results in a cencorship resistant block creation that requires that an amount == fee of the transaction they are consoring, be burned in order to censor it.

## Mechanism
We have an auction where everyone bids the amount of eth they are willing to burn in order to get the right to create the next block.

The winning bid is the highest amount of eth. This address is assigned teh right to create the next block.

## Incentives
Every block proposer has the following properties

target_profit the profit they want to make mining this block.

They also have a list of transactions that can be included in a block they calculate

sum_total_fees = SUM (tx1.fee , tx2.fee, tx3.fee … txN.fee) where tx1 to txN are the transactions ordered by fee.
They caculate their burn_bid = sum_total_fees - target_profit

and publish this as they bid.

- If everyone has the same sum_total_fees we select the bid that has the lowest target_profit.
- If bidders have a different view of sum_total_fees we select either highest overall bid. This means that if a block creator wants to censor tx.2 they need to reduce their target profit by tx.2.fee in order to win the auction.

# Implementation details
- Contract having auctions for auctioning right to submitbatch for slots(comprising of one or multiple blocks).
- Slot based auction system used where slots are related with Blocknumber and currentslot will be (current Blocknumber - genesis block)/blocks per slot
- Any Co-ordinator can bid for any number of slots two slots ahead of current slot.
- Some other Co-ordinator can outbid previous co-ordinator with better bid.
- If auction for a slot concludes(less than two slots ahead of currentslot),Co-ordinator is slot owner and can submit batch for that concluded slot.
- We just burn the amount in the bid and the coordiantor gets all the fees. We assume the sum(fees) > burn.
- Coordinator Slot Duration: 40 ETH blocks
- New Slot opens every: 80 ETH blocks
- Transactions censoring prevented by cost of constant bidding and burning own ether to stay as batch submitter for long time with constant burn rate of capital spent.
- Pricing machanism of Auctions is based on barry's proposal for block creator selection
https://ethresear.ch/t/spam-resistant-block-creator-selection-via-burn-auction/5851

## Project github Repo
https://github.com/snaketh4x0r/BurnAuctionProject

## project notes
https://hackmd.io/ZwQWkWeeT1Ku65vI0ERJnw

## Coverage reports
https://gist.github.com/snaketh4x0r/730aa0a7f11062be11bcdef71785f450

## Installation

**have truffle and ganache installed locally**
**node == 10.13.0,truffle >= 5**
1. git clone
2. npm i
3. npm run ganache
4. in another terminal npm run migrate
4. run tests with npm run test

## File Structure

burnauctionproject
├── README.md
├── build
│   └── contracts
│       ├── BurnAuction.json
│       ├── Migrations.json
│       ├── SafeMath.json
│       └── hubbletest.json
├── contracts
│   ├── BurnAuction.sol
│   ├── Migrations.sol
│   └── hubbletest.sol
├── coverage
│   ├── base.css
│   ├── contracts
│   │   ├── BurnAuction.sol.html
│   │   ├── hubbletest.sol.html
│   │   └── index.html
│   ├── coverage-final.json
│   ├── index.html
│   ├── lcov-report
│   │   ├── base.css
│   │   ├── contracts
│   │   ├── index.html
│   │   ├── prettify.css
│   │   ├── prettify.js
│   │   ├── sort-arrow-sprite.png
│   │   └── sorter.js
│   ├── lcov.info
│   ├── prettify.css
│   ├── prettify.js
│   ├── sort-arrow-sprite.png
│   └── sorter.js
├── coverage.json
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── package-lock.json
├── package.json
├── test
│   ├── BurnAuction.spec.ts
│   └── Tests.ts
├── truffle-config.js
├── tsconfig.json
└── types
    └── truffle-contracts
        ├── index.d.ts
        └── merge.d.ts