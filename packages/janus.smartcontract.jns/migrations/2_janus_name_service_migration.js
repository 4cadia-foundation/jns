const JanusNameService = artifacts.require("JanusNameService");

module.exports = function(deployer) {
  deployer.deploy(JanusNameService);
};
