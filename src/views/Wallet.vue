<template>
    <div class="wallet_view" ref="wallet_view">
        <template>
            <GuideModal class="moo" ref="guide_modal"></GuideModal>
        </template>
        <UpdateKeystoreModal v-if="isManageWarning"></UpdateKeystoreModal>
        <transition name="fade" mode="out-in">
            <sidebar class="panel sidenav"></sidebar>
        </transition>
        <div class="wallet_main">
            <top-info class="wallet_top"></top-info>
            <transition name="fade" mode="out-in">
                <keep-alive
                    :exclude="['cross_chain', 'activity', 'advanced', 'earn', 'manage', 'studio']"
                >
                    <router-view id="wallet_router" :key="$route.path"></router-view>
                </keep-alive>
            </transition>
        </div>
        <transition name="fade" mode="out-in">
            <main-panel />
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopInfo from '@/components/wallet/TopInfo.vue'
import Sidebar from '@/components/wallet/Sidebar.vue'
import MainPanel from '@/components/SidePanels/MainPanel.vue'
import UpdateKeystoreModal from '@/components/modals/UpdateKeystore/UpdateKeystoreModal.vue'
import GuideModal from '@/components/modals/GuideModal.vue'

const TIMEOUT_DURATION = 60 * 7 // in seconds
const TIMEOUT_DUR_MS = TIMEOUT_DURATION * 1000

@Component({
    components: {
        Sidebar,
        MainPanel,
        TopInfo,
        UpdateKeystoreModal,
        GuideModal,
    },
})
export default class Wallet extends Vue {
    intervalId: NodeJS.Timeout | null = null
    logoutTimestamp = Date.now() + TIMEOUT_DUR_MS
    isLogOut = false

    // Set the logout timestamp to now + TIMEOUT_DUR_MS
    resetTimer() {
        this.logoutTimestamp = Date.now() + TIMEOUT_DUR_MS
    }
    $refs!: {
        guide_modal: GuideModal
        wallet_view: HTMLDivElement
    }

    checkLogout() {
        let now = Date.now()

        // Logout if current time is passed the logout timestamp
        if (now >= this.logoutTimestamp && !this.isLogOut) {
            this.isLogOut = true
            this.$store.dispatch('timeoutLogout')
        }
    }

    created() {
        this.resetTimer()
        if (document.domain !== 'localhost')
            this.intervalId = setInterval(() => {
                this.checkLogout()
            }, 1000)
    }

    unload(event: BeforeUnloadEvent) {
        // user has no wallet saved
        if (!localStorage.getItem('w') && this.hasVolatileWallets && this.isLogOut) {
            event.preventDefault()
            this.isLogOut = false
            event.returnValue = ''
            this.$router.push('/wallet/keys')
            this.resetTimer()
        }
    }

    mounted() {
        let view = this.$refs.wallet_view

        view.addEventListener('mousemove', this.resetTimer)
        view.addEventListener('mousedown', this.resetTimer)

        window.addEventListener('beforeunload', this.unload)
        if (!this.kycStatus) this.$refs.guide_modal.open()
    }

    beforeDestroy() {
        let view = this.$refs.wallet_view
        // Remove Event Listeners
        view.removeEventListener('mousemove', this.resetTimer)
        view.removeEventListener('mousedown', this.resetTimer)
        window.removeEventListener('beforeunload', this.unload)
    }

    destroyed() {
        clearInterval(this.intervalId!)
    }
    get kycStatus(): boolean {
        return this.$store.getters['Accounts/kycStatus']
    }
    get isManageWarning(): boolean {
        if (this.$store.state.warnUpdateKeyfile) {
            return true
        }
        return false
    }

    get hasVolatileWallets() {
        return this.$store.state.volatileWallets.length > 0
    }
}
</script>

<style scoped>
.moo {
    position: absolute;
}
</style>
