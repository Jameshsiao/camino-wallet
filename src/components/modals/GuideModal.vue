<template>
    <div>
        <Modal
            ref="modal"
            :title="$t('kyc_process.title')"
            class="modal_main"
            @beforeClose="beforeClose"
        ></Modal>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Modal from '@/components/modals/Modal.vue'

@Component({
    components: {
        Modal,
    },
})
export default class GuideModal extends Vue {
    $refs!: {
        modal: Modal
    }

    async open() {
        this.$refs.modal.open()
    }

    async close() {}

    beforeClose() {}
}
</script>
<style scoped lang="scss">
@use '../../styles/main';
</style>
