var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  deployer.deploy(Auction, "salt", 2, 0, web3.toWei(1,"ether"));
};
