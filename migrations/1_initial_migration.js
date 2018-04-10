var Migrations = artifacts.require("./Migrations.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Lottery);
};

