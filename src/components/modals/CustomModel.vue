<template>
    <transition name="fade">
        <!-- <div class="modal_main" v-if="isActive">
            <div class="modal_bg" @click="bgclick" :icy="icy"></div>
            <div class="modal_body">
                <div class="modal_topbar">
                    <h4 class="modal_title">{{ title }}</h4>
                    <button class="modalClose" @click="close" v-if="can_close">
                        <fa icon="times"></fa>
                    </button>
                </div>
                <slot></slot>
            </div>
        </div> -->
    </transition>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class CustomModel extends Vue {
    @Prop({ default: 'Model Title' }) title!: string
    @Prop({ default: 'Model SubTitle' }) sub_title!: string
    @Prop({ default: true }) can_close!: string
    @Prop({ default: false }) icy!: boolean

    isActive: boolean = false

    public open() {}
}
</script>
