const { getAccountAddress } = require('@blockrocket/utils');

const MNEMONIC = process.env.ESCROW_MNEMONIC || '';
const INFURA_KEY = process.env.ESCROW_INFURA_KEY || '';

const WETH9 = artifacts.require("WETH9");

module.exports = async function (deployer, network, accounts) {
    console.log("Deploying mock erc20: " + network);

    const creator = getAccountAddress(accounts, 0, network, MNEMONIC, INFURA_KEY);

    await deployer.deploy(WETH9, {from: creator});
};
