var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  deployer.deploy(
    Auction, 
    "Auction Porsche",
    1,
    20,
    "0x608AfE7bA0d3698683F952fd33621eF1BA08aA0D"
    // "0xd2c43daaccc1fcb2061d5a58099c1195e24f1f89"
  );
};
