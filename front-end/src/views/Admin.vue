<template>
    <div class="container mt-4">
        <div class="row mt-5 mb-5">
            <div class="col-6">
                <div class="card min-height-300">
                    <div class="card-header">
                        <h5>Cancel Time Lock</h5>
                    </div>
                    <div class="card-body">
                        <div>
                            <label class="fixed-width-label text-right"
                                   for="inputCancelBeneficiaryLockup">Beneficiary:</label>
                            <input type="text"
                                   id="inputCancelBeneficiaryLockup"
                                   class="ml-2 form-control fixed-width-input d-inline-block"
                                   placeholder="0x123..."
                                   v-model="form.cancelBeneficiaryLock"/>
                        </div>
                    </div>
                    <div class="card-footer text-right">
                        <b-button variant="primary" class="mt-2" @click="cancelTimelock" :disabled="cancelling">
                            <span v-if="!cancelling">Cancel Lock</span>
                            <SmallSpinner v-else/>
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {ethers} from 'ethers';
    import utils from '../utils';
    import TimeLockTokenEscrow from '../truffleconf/TimeLockTokenEscrow';
    import TestToken from '../truffleconf/TestToken';

    import SmallSpinner from '../components/SmallSpinner';
    import DateTimePicker from '../components/DateTimePicker';

    export default {
        name: 'admin',
        components: {SmallSpinner, DateTimePicker},
        async created() {
            await window.ethereum.enable();
            this.web3.provider = new ethers.providers.Web3Provider(web3.currentProvider);
            this.web3.signer = this.web3.provider.getSigner();
            this.web3.chain = await this.web3.provider.getNetwork();

            const escrowContractAddress = utils.getContractAddressFromTruffleConf(TimeLockTokenEscrow, this.web3.chain.chainId);
            this.web3.escrowContract = new ethers.Contract(
                escrowContractAddress,
                TimeLockTokenEscrow.abi,
                this.web3.signer,
            );

            // const tokenAddress = utils.getContractAddressFromTruffleConf(TestToken, this.web3.chain.chainId);
            const tokenAddress = await this.web3.escrowContract.token();
            this.web3.genericERC20TokenContract = new ethers.Contract(
                tokenAddress,
                TestToken.abi,
                this.web3.signer
            );
        },
        data() {
            return {
                form: {
                    cancelBeneficiaryLock: '',
                },
                web3: {
                    provider: null,
                    signer: null,
                    chain: null,
                    escrowContract: null,
                    genericERC20TokenContract: null
                },
                cancelling: false,
            };
        },
        methods: {
            async cancelTimelock() {
                this.cancelling = true;

                const withdrawalTx = await this.web3.escrowContract.revertLock(
                    this.form.cancelBeneficiaryLock,
                    {
                        gasLimit: 250000
                    }
                );
                await withdrawalTx.wait(1);

                this.cancelling = false;
            },
        }
    };
</script>

<style>
    .fixed-width-label {
        width: 100px;
    }

    .fixed-width-input {
        width: 375px !important;
    }

    input#tj-datetime-input {
        border: 1px solid #ffffff;
    }

    .min-height-300 {
        min-height: 300px;
    }
</style>
