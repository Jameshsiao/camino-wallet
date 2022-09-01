<template>
    <div>
        <Modal
            ref="modal"
            title="Simplify Creating Wallet"
            class="modal_main"
            @beforeClose="beforeClose"
        >
            <div v-if="kycStatus">
                <div>checked</div>
                <div>{{ kycStatus }}</div>
            </div>
            <div v-else @click="openKyc">go to check</div>
            <button
                v-if="walletType === 'mnemonic'"
                :tooltip="$t('top.hover2')"
                @click="viewPrintModal"
                class="print_but"
            >
                <v-icon>mdi-water-outline</v-icon>
            </button>
        </Modal>
        <KycModal ref="kyc_modal"></KycModal>
        <paper-wallet
            ref="print_modal"
            v-if="walletType === 'mnemonic'"
            :wallet="activeWallet"
        ></paper-wallet>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'
import KycModal from './KycModal.vue'
import PaperWallet from './PaperWallet/PaperWallet.vue'
import { WalletType, WalletNameType } from '@/js/wallets/types'
@Component({
    components: {
        Modal,
        KycModal,
        PaperWallet,
    },
})
export default class GuideModal extends Vue {
    $refs!: {
        modal: Modal
        kyc_modal: KycModal
        print_modal: PaperWallet
    }

    async open() {
        this.$refs.modal.open()
    }
    viewPrintModal() {
        this.$refs.print_modal.open()
    }
    async close() {
        this.$refs.modal.close()
    }
    get walletType(): WalletNameType {
        let wallet = this.activeWallet
        if (!wallet) return 'mnemonic'
        return wallet.type
    }
    get activeWallet(): WalletType | null {
        return this.$store.state.activeWallet
    }
    get kycStatus(): boolean {
        return this.$store.getters['Accounts/kycStatus']
    }
    openKyc() {
        this.$refs.kyc_modal.open()
        console.log('asdfkjhdsfh')
    }
    mounted() {
        console.log(this.kycStatus)
        console.log(this.$store.state.activeWallet.getCurrentAddressPlatform())
    }
    beforeClose() {}
}
</script>
<style scoped lang="scss">
@use '../../styles/main';
.modal_main::v-deep {
    .modal_body {
        width: 70%;
        max-width: 750px;
        height: min-content !important;
        /* min-height: 450px !important; */
        border-radius: var(--border-radius-sm) !important;
        overflow: auto;
        min-height: 200px;
        @include main.mobile-device {
            max-height: 90vh;
            max-width: none;
            width: 80%;
            min-height: fit-content;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .modal_bg {
        width: 100vw !important;
        position: fixed;
    }
}
</style>
