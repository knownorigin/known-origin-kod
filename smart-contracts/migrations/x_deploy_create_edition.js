const { getAccountAddress } = require('@blockrocket/utils');

const MNEMONIC = process.env.ESCROW_MNEMONIC || '';
const INFURA_KEY = process.env.ESCROW_INFURA_KEY || '';

const KOSelfServiceMock = artifacts.require("KOSelfServiceMock");

module.exports = async function (deployer, network, accounts) {
    console.log("Deploying mock create edition: " + network);

    const creator = getAccountAddress(accounts, 0, network, MNEMONIC, INFURA_KEY);

    await deployer.deploy(KOSelfServiceMock, {from: creator});
};
