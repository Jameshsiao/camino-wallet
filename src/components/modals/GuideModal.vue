<template>
    <div>
        <Modal
            ref="modal"
            :title="$t('kyc_process.title')"
            class="modal_main"
            @beforeClose="beforeClose"
        >
            <div class="guideModalBody">
                <!-- <ol class="guideMenu" type="1">
                    <li class="save_account">
                        <button class="account_but" @click="openSave">
                            <span>1. Save Account</span>
                        </button>
                        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                    </li>
                    <hr />
                    <li class="save_account">
                        <button class="account_but" @click="openSave">
                            <span>1. Save Account</span>
                        </button>
                        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                    </li>
                    <hr />
                    <button class="copyBut" @click="copyAddress">
                        <span>2. Start Verification Process</span>
                        <input ref="copytext" value="looool" />
                    </button>
                    <hr />
                    <button class="copyBut" @click="copyAddress">
                        <span>3- Copy P-Chain Address</span>
                        <input ref="copytext" value="looool" />
                    </button>
                    <hr />
                    <button class="copyBut" @click="copyAddress">
                        <span>4. Print paper Wallet</span>
                        <input ref="copytext" value="looool" />
                    </button>
                </ol> -->
                <span class="secondary_title">We suggest you perform the following steps:</span>
                <ul class="guideMenu" type="1">
                    <li class="list_item">
                        <div class="save_account">
                            <button class="account_but" @click="openSave">
                                <span>1. Save Account</span>
                            </button>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </div>
                        <hr />
                    </li>
                    <li>
                        <div class="save_account">
                            <button class="account_but" @click="openSave">
                                <span>2. Start Verification Process</span>
                            </button>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </div>
                        <hr />
                    </li>
                    <li>
                        <div class="save_account">
                            <button class="account_but" @click="openSave">
                                <span>3. Copy P-Chain Address</span>
                            </button>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </div>
                        <hr />
                    </li>
                    <li>
                        <div class="save_account">
                            <button class="account_but" @click="openSave">
                                <span>4. Print paper Wallet</span>
                            </button>
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                        </div>
                    </li>
                </ul>
                <v-btn class="button_secondary guide_btn" @click="close">Done</v-btn>
            </div>
        </Modal>
        <SaveAccountModal ref="save_modal"></SaveAccountModal>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Vue } from 'vue-property-decorator'
import { iUserAccountEncrypted } from '@/store/types'
import Modal from '@/components/modals/Modal.vue'
import KycModal from '@/components/modals/KycModal.vue'
import SaveAccountModal from '@/components/modals/SaveAccount/SaveAccountModal.vue'
import AccountSettingsModal from '@/components/modals/AccountSettings/AccountSettingsModal.vue'
import { WalletType, WalletNameType } from '@/js/wallets/types'

@Component({
    components: {
        Modal,
        SaveAccountModal,
        AccountSettingsModal,
        KycModal,
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
    .v-icon {
        color: var(--secondary-color);
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

// .v-input {
//     margin-top: 0px;
// }

// .copyBut input {
//     display: none;
// }
</style>
