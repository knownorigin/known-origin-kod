const {BN, expectRevert, expectEvent, constants, time, balance} = require('@openzeppelin/test-helpers');
const {ZERO_ADDRESS} = constants;
require('chai').should();

const WETH9 = artifacts.require('WETH9');
const MolochV1KOD = artifacts.require('MolochV1KOD');
const GuildBank = artifacts.require('GuildBank');

function now() {
    return Math.floor(Date.now() / 1000);
}

const zero = new BN('0');
const pointOneEth = new BN('100000000000000000');
const zeroPointOneEth = new BN('10000000000000000');

contract('KOD tests', function ([creator, mrOne, msTwo, ...accounts]) {
    beforeEach(async function () {
        this.token = await WETH9.new(creator, {from: creator});

        (await this.token.balanceOf(creator)).should.be.bignumber.equal(zero);

        this.kod = await MolochV1KOD.new(
            creator,
            this.token.address,
            3600,
            2,
            1,
            1,
            pointOneEth,
            3,
            zeroPointOneEth,
            {from: creator}
        );
        (await this.kod.members(creator))[1].should.be.bignumber.equal('1');

        this.guildBankAddress = await this.kod.guildBank();
        this.guildBank = await GuildBank.at(this.guildBankAddress.toString());
    });

    describe('flip() - convert ETH to wETH', function () {
        describe('happy path', function () {
            it('converts any ETH in the guild bank to wEth and the share price increases', async function () {
                let bankBalance = await balance.tracker(this.guildBankAddress);

                // bank has zero wETH
                (await this.token.balanceOf(this.guildBankAddress)).should.be.bignumber.equal(zero);

                // bank has zero ETH
                (await bankBalance.delta()).should.be.bignumber.equal(zero);

                // send 0.1 eth to the bank
                await web3.eth.sendTransaction({from: creator, to: this.guildBankAddress, value: pointOneEth});

                (await bankBalance.delta()).should.be.bignumber.equal(pointOneEth);

                // convert ETH to wETH
                await this.guildBank.flip();

                (await this.token.balanceOf(this.guildBankAddress)).should.be.bignumber.equal(pointOneEth);
                (await bankBalance.delta()).should.be.bignumber.equal(pointOneEth.neg());
            });
        });
    });
});
