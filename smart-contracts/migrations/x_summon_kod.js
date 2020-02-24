const {getAccountAddress} = require('@blockrocket/utils');

const MNEMONIC = process.env.ESCROW_MNEMONIC || '';
const INFURA_KEY = process.env.ESCROW_INFURA_KEY || '';

const WETH9 = artifacts.require("WETH9");
const KOSelfServiceMock = artifacts.require("KOSelfServiceMock");
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

    // '0xf4e3e80265559EcD76acebCA4bA9a29bd5991D05' << WETH9 Rinkeby
    // '0x9495997eaa3bF58A63407bE1Ef771cAc7D6a204C' << Rinkeby KO Self-serve

    const token = await WETH9.deployed();

    const createEdition = await KOSelfServiceMock.deployed();

    console.log(`CE >>> ${createEdition.address}`);

    await deployer.deploy(
        MolochV1KOD,
        creator,
        token.address,
        3600, // 1 hour
        48, // 2 days
        24, // 1 day
        '12300000000000000', // 3 usd-ish
        3,
        '40100000000000', // 1 cent
        '0x9495997eaa3bF58A63407bE1Ef771cAc7D6a204C',
        {from: creator}
    );

    // LIVE
    // await deployer.deploy(
    //     MolochV1KOD,
    //     creator,
    //     '',
    //     3600, // 1 hour
    //     48, // 2 days
    //     24, // 1 day
    //     '12300000000000000', // 3 usd-ish
    //     3,
    //     '40100000000000', // 1 cent
    //     '',
    //     {from: creator}
    // );
};
