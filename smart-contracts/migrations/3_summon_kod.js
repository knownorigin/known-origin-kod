const {getAccountAddress} = require('@blockrocket/utils');

const MNEMONIC = process.env.ESCROW_MNEMONIC || '';
const INFURA_KEY = process.env.ESCROW_INFURA_KEY || '';

const WETH9 = artifacts.require("WETH9");
const MolochV1KOD = artifacts.require("MolochV1KOD");

module.exports = async function (deployer, network, accounts) {
    console.log("Deploying KOD contract to network: " + network);

    const creator = getAccountAddress(accounts, 0, network, MNEMONIC, INFURA_KEY);

    // constructor(
    //     address summoner,
    //     address _approvedToken,
    //     uint256 _periodDuration,
    //     uint256 _votingPeriodLength,
    //     uint256 _gracePeriodLength,
    //     uint256 _abortWindow,
    //     uint256 _proposalDeposit,
    //     uint256 _dilutionBound,
    //     uint256 _processingReward
    // )

    const token = await WETH9.deployed();
    await deployer.deploy(
        MolochV1KOD,
        creator,
        token.address,
        3600,
        2,
        1,
        1,
        '10000000000000000',
        3,
        '10000000000000000',
        {from: creator}
    );
};
