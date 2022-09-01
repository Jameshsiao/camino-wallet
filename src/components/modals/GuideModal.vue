<template>
    <div>
        <Modal
            ref="modal"
            :title="$t('kyc_process.title')"
            class="modal_main"
            @beforeClose="beforeClose"
        >
            <div class="guideModalBody">
                <span class="secondary_title">We suggest you perform the following steps:</span>
                <ul class="guideMenu" type="1">
                    <li class="list_item">
                        <div class="save_account">
                            <v-btn class="account_but" @click="openSave">
                                <span>1. Save Account</span>
                            </v-btn>
                            <v-icon v-if="account" class="checked">
                                mdi-checkbox-marked-circle-outline
                            </v-icon>
                            <v-icon v-else class="not-checked">
                                mdi-checkbox-marked-circle-outline
                            </v-icon>
                        </div>
                        <hr />
                    </li>
                    <li>
                        <div class="save_account">
                            <v-btn
                                class="account_but"
                                @click="copyAddress"
                                :disabled="selectedNetwork !== 'camino'"
                            >
                                <span>2. Copy P-Chain Address</span>
                            </v-btn>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                            <!-- <input ref="copytext" value="test" /> -->
                        </div>
                        <hr />
                    </li>
                    <li>
                        <div class="save_account">
                            <v-btn
                                :tooltip="$t('top.hover2')"
                                @click="viewPrintModal"
                                class="print_but"
                                :disabled="
                                    selectedNetwork !== 'camino' || walletType !== 'mnemonic'
                                "
                            >
                                <span>3. Print paper Wallet</span>
                            </v-btn>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </div>
                        <hr />
                    </li>
                    <li>
                        <div class="save_account">
                            <v-btn class="account_but" @click="openKyc">
                                <span>4. Start Verification Process</span>
                            </v-btn>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </div>
                    </li>
                </ul>
                <v-btn class="button_secondary guide_btn" @click="close">Done</v-btn>
            </div>
        </Modal>
        <SaveAccountModal ref="save_modal"></SaveAccountModal>
        <paper-wallet
            ref="print_modal"
            v-if="walletType === 'mnemonic'"
            :wallet="activeWallet"
        ></paper-wallet>
        <KycModal ref="kyc_modal"></KycModal>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { iUserAccountEncrypted } from '@/store/types'
import Modal from '@/components/modals/Modal.vue'
import KycModal from '@/components/modals/KycModal.vue'
import SaveAccountModal from '@/components/modals/SaveAccount/SaveAccountModal.vue'
import AccountSettingsModal from '@/components/modals/AccountSettings/AccountSettingsModal.vue'
import { WalletType, WalletNameType } from '@/js/wallets/types'
import PaperWallet from './PaperWallet/PaperWallet.vue'

@Component({
    components: {
        Modal,
        SaveAccountModal,
        AccountSettingsModal,
        KycModal,
        PaperWallet,
    },
})
export default class GuideModal extends Vue {
    saveAccountState = false

    $refs!: {
        modal: Modal
        save_modal: SaveAccountModal
        settings_modal: AccountSettingsModal
        kyc_modal: KycModal
        copytext: HTMLInputElement
        print_modal: PaperWallet
    }

    get account(): iUserAccountEncrypted | null {
        return this.$store.getters['Accounts/account']
    }

    async openSave() {
        this.$refs.save_modal.open()
    }

    async open() {
        this.$refs.modal.open()
    }

    get activeWallet(): WalletType | null {
        return this.$store.state.activeWallet
    }
    get walletType(): WalletNameType {
        let wallet = this.activeWallet
        if (!wallet) return 'mnemonic'
        return wallet.type
    }
    get selectedNetwork(): string {
        return this.$store.getters['Network/activeNetwork'].name
    }
    viewPrintModal() {
        this.$refs.print_modal.open()
    }
    get addressPVM() {
        let wallet = this.activeWallet
        if (!wallet) {
            return '-'
        }
        return wallet.getCurrentAddressPlatform()
    }
    async copyAddress() {
        let copytext = this.$refs.copytext
        copytext.select()
        copytext.setSelectionRange(0, 99999)
        document.execCommand('copy')
        this.$store.dispatch('Notifications/add', {
            title: ' Copied',
            message: 'Copied to clipboard.',
        })
    }
    openKyc() {
        this.$refs.kyc_modal.open()
    }
    async close() {}

    beforeClose() {}
}
</script>
<style scoped lang="scss">
@use '../../styles/main';

.guideModalBody {
    padding: 20px 40px 30px;
    border-radius: var(--border-radius-sm);
    overflow: auto;
}
.guideMenu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: center;
    // min-width: 500px;
    max-width: 100%;
    width: 500px;
}

.secondary_title {
    font-size: 17px;
    opacity: 0.6;
}

ul {
    padding-left: 0px !important;
    font-weight: 900;
    font-size: 20px;
    list-style: none;
    margin-bottom: 30px;
    margin-top: 30px;
    .checked {
        color: var(--secondary-color);
    }
    .not-checked {
        color: white;
        opacity: 0.6;
    }
}

.save_account {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    width: 100%;
}

hr {
    margin-top: 15px;
    margin-bottom: 15px;
    border-width: 0px;
    border-bottom: 2px solid var(--bg-light);
}

.guide_btn {
    width: 100%;
    height: 40px;
    font-weight: 900;
}

.v-input {
    margin-top: 0px;
}

.copyBut input {
    display: none;
}
</style>
