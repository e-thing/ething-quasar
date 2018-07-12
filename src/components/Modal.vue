<template>
  <q-modal ref="modal" class="column" :value="value" @input="$emit('input', $event)">
    <div v-if="title" class="col-auto q-pa-md bg-primary text-white title">{{ title }}</div>
    <div class="col q-pa-md">
      <slot></slot>
    </div>
    <div v-if="btns.length>0" class="q-px-md q-pb-md">
      <q-btn
        v-for="(btn, index) in btns" :key="index"
        :color="btn.color"
        @click="onBtnClick(btn)"
        :label="btn.label"
        :flat="btn.flat"
        :disable="btn.disable"
      />
    </div>
  </q-modal>
</template>

<script>

export default {
    name: 'Modal',

    props: {
      title: String,
      value: {},
      validBtnHide: Boolean,
      validBtnDisabled: Boolean,
      validBtnLabel: {
        type: String,
        default: 'Valid'
      },
      cancelBtnHide: Boolean,
      cancelBtnDisabled: Boolean,
      cancelBtnLabel: {
        type: String,
        default: 'Cancel'
      },
      buttons: Array
    },

    data () {

      var btns = []

      if (!this.validBtnHide) {
        btns.push({
          label: this.validBtnLabel,
          color: 'primary',
          onclick:  () => {
            this.$emit('valid')
          },
          disable: this.validBtnDisabled
        })
      }

      if (!this.cancelBtnHide) {
        btns.push({
          label: this.cancelBtnLabel,
          color: 'negative',
          flat: true,
          onclick:  () => {
            this.$emit('cancel')
            this.hide()
          },
          disable: this.cancelBtnDisabled
        })
      }

      if (this.buttons) btns = btns.concat(this.buttons)

      return {
        btns
      }
    },

    methods: {

      onBtnClick (btn) {
        btn.onclick.call(this)
      },

      hide () {
        this.$refs.modal.hide()
      },
      show () {
        this.$refs.modal.show()
      },
      toggle () {
        this.$refs.modal.toggle()
      },
    }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

</style>
