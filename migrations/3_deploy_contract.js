var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  deployer.deploy(
    Auction, 
    "Auction Porsche",
    1,
    20,
    "0xd2c43daaccc1fcb2061d5a58099c1195e24f1f89"
  );
};
