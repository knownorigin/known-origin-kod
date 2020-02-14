const {BN, expectRevert, expectEvent, constants, time, balance} = require('@openzeppelin/test-helpers');
const {ZERO_ADDRESS} = constants;
require('chai').should();

const WETH9 = artifacts.require('WETH9');
const KOSelfServiceMock = artifacts.require('KOSelfServiceMock');
const MolochV1KOD = artifacts.require('MolochV1KOD');
const GuildBank = artifacts.require('GuildBank');

function now() {
    return Math.floor(Date.now() / 1000);
}

const zero = new BN('0');
const pointOneEth = new BN('100000000000000000');
const zeroPointOneEth = new BN('10000000000000000');

const onePeriod = new BN('3600');

contract('KOD tests', function ([creator, mrOne, msTwo, ...accounts]) {
    beforeEach(async function () {
        this.token = await WETH9.new(creator, {from: creator});
        this.createEdtion = await KOSelfServiceMock.new(creator, {from: creator});

        (await this.token.balanceOf(creator)).should.be.bignumber.equal(zero);

        this.kod = await MolochV1KOD.new(
            creator,
            this.token.address,
            3600,
            1,
            1,
            1,
            pointOneEth,
            3,
            zeroPointOneEth,
            this.createEdtion.address,
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
                (await bankBalance.delta()).should.be.bignumber.equal(pointOneEth.neg()); // -pointOneEth
            });
        });
    });

    describe('submitNFTProposal() - NFTs via DAOs!', function () {
        describe('happy path', function () {
            it('adds a NFT proposal and processes it creating an NFT', async function () {

                await web3.eth.sendTransaction({
                    from: creator,
                    to: this.token.address,
                    value: pointOneEth.add(pointOneEth)
                }); // tribute + deposit

                await this.token.approve(this.kod.address, pointOneEth.add(pointOneEth), {from: creator}); // tribute + deposit

                await this.kod.submitNFTProposal(
                    1, // shares
                    "Mona Lisa NFT",
                    5, // quantity
                    pointOneEth, // price
                    "abcdef", // hash
                    80,
                    5,
                    {from: creator}
                );

                const queueLen = await this.kod.getProposalQueueLength();
                const proposalIndex = queueLen.sub(new BN('1'));
                const nftProposalDeets = await this.kod.nftProposals(proposalIndex); // zero indexed

                nftProposalDeets.totalAvailable.should.be.bignumber.equal("5");
                nftProposalDeets.priceInWei.should.be.bignumber.equal(pointOneEth);
                nftProposalDeets.tokenUri.should.be.equal("abcdef");

                const summoningTime = await this.kod.summoningTime();
                const votingStart = summoningTime.add(onePeriod);
                await time.increaseTo(votingStart);

                // vote
                await this.kod.submitVote(proposalIndex, 1); // Yes

                const processingStart = votingStart.add(onePeriod).add(onePeriod); // extend past grace period
                await time.increaseTo(processingStart);

                await this.kod.processProposal(proposalIndex);

                const proposal = await this.kod.proposalQueue(proposalIndex);
                proposal.didPass.should.be.equal(true);
            });
        });
    });
});
