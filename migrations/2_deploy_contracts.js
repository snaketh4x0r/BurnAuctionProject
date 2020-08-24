const BurnAuction = artifacts.require('BurnAuction');
const hubbletest = artifacts.require('hubbletest');

const maxTx = 100;
const burnAddress = "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4";
const blocksperslot = 100;
const delay = 0;
const minBid = 10000000000;
const minnextslot = 2;
const courl = "hellocoordinator.com"
const coadd= "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4";
const cosubmitadd = "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4";

module.exports = async function(deployer) {
  await deployer.deploy(BurnAuction,maxTx,burnAddress,blocksperslot,delay,minBid,minnextslot,coadd,cosubmitadd,courl).then(function(){
      return deployer.deploy(hubbletest,BurnAuction.address);
  });
};