let Util = artifacts.require("./Util.sol");
let Auction = artifacts.require("./Auction.sol");
let AuctionTest = artifacts.require("./AuctionTest.sol");

module.exports = async function(deployer) {
    await deployer.deploy(Util);
    deployer.link(Util, Auction);
    deployer.link(Util, AuctionTest);
};

// precisa fazer a "linkagem" entre a Library e os Smart Contract que irão utilizar essa biblioteca
