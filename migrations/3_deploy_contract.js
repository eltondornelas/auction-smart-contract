var Auction = artifacts.require("./Auction.sol");

module.exports = function(deployer) {
  deployer.deploy(
    Auction, 
    "Auction Porsche",
    1,
    20,
    "0x3f6b88fcabd9394e76d85d81b343a6221486fc297f38c0549809fc36e79be808"
  );
};
