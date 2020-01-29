const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = process.env.ESCROW_MNEMONIC || '';
const INFURA_KEY = process.env.PROTOTYPE_BR_INFURA_KEY || '';
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || '';

/**
 * Loads mocha settings based on which shell env variables are set. Options are:
 *   - GAS_REPORTER: run gas analytics with tests
 */
const mocha = require('./mocha-config');

module.exports = {
  // N.B - this seems to crash solidity-coverage so dont run at the same time
  mocha,
  compilers: {
    solc: {
      version: '0.5.14',
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      gas: 6721975, // <-- Use this high gas value
      gasPrice: 1000000000,    // <-- Use this low gas price
      network_id: '*', // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${INFURA_KEY}`);
      },
      network_id: 3,
      gas: 7000000, // default = 4712388
      gasPrice: 25000000000, // 25 Gwei. default = 100 gwei = 100000000000
      skipDryRun: true
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_KEY}`);
      },
      network_id: 4,
      gas: 6000000,
      gasPrice: 25000000000, // 25 Gwei. default = 100 gwei = 100000000000
      skipDryRun: true
    },
    live: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${INFURA_KEY}`);
      },
      network_id: 1,
      gas: 6075039,         // default = 4712388
      gasPrice: 2500000000, // default = 100 gwei = 100000000000
      timeoutBlocks: 200,   // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true      // Skip dry run before migrations? (default: false for public nets )
    },
  },
  plugins: [
    'truffle-plugin-verify',
    'solidity-coverage'
  ],
  verify: {
    preamble: 'Author: BlockRocket.tech.\n'
  },
  api_keys: {
    etherscan: ETHERSCAN_KEY
  }
};
