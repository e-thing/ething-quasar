<template>
  <q-modal
    ref="modal"
    class="column"
    :value="value"
    @input="$emit('input', $event)"
    v-bind="$attrs"
    :content-css="contentCss"
    @show="$emit('show', $event)"
    @escape-key="$emit('cancel')"
    @dismiss="$emit('cancel')"
  >
    <q-modal-layout
      header-class="no-shadow"
      footer-class="no-shadow"
    >

      <q-toolbar v-if="title" slot="header">
        <q-icon
          v-if="icon"
          :name="icon"
          class="q-ml-sm"
        />
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <q-btn
          v-if="!$attrs['no-esc-dismiss']"
          flat round dense
          icon="close"
          @click="onCloseBtnClick"
        />
      </q-toolbar>

      <div class="q-py-md q-px-lg">
        <slot></slot>
      </div>

      <q-toolbar v-if="!noButtons" slot="footer" inverted >
        <q-toolbar-title>
          <q-btn
            v-if="!validBtnHide"
            :color="validBtnColor"
            @click="onValidBtnClick()"
            :label="validBtnLabel"
            :disable="validBtnDisable"
            :loading="validBtnLoading"
            class="q-mr-sm"
          />

          <q-btn
            v-if="!cancelBtnHide"
            :color="cancelBtnColor"
            @click="onCancelBtnClick()"
            :label="cancelBtnLabel"
            :disable="cancelBtnDisable"
            flat
            class="q-mr-sm"
          />

          <q-btn
            v-for="(btn, index) in buttons" :key="index"
            :color="btn.color"
            @click="onBtnClick(btn)"
            :label="btn.label"
            :flat="btn.flat"
            :disable="btn.disable"
            class="q-mr-sm"
          />

          <slot name="buttons"></slot>
        </q-toolbar-title>
      </q-toolbar>

    </q-modal-layout>
  </q-modal>
</template>

<script>

export default {
    name: 'Modal',

    props: {
      title: String,
      icon: String,
      value: {},

      size: {
        type: String,
        default: 'md'
      },

      noButtons: Boolean,

      validBtnHide: Boolean,
      validBtnDisable: Boolean,
      validBtnLoading: Boolean,
      validBtnLabel: {
        type: String,
        default: 'Valid'
      },
      validBtnColor: {
        type: String,
        default: 'primary'
      },

      cancelBtnHide: Boolean,
      cancelBtnDisable: Boolean,
      cancelBtnLabel: {
        type: String,
        default: 'Cancel'
      },
      cancelBtnColor: {
        type: String,
        default: 'negative'
      },

      buttons: Array
    },

    data () {

      return {}
    },

    computed: {
      contentCss () {
        var css = {}

        if ( this.size == 'xs') {
          css = {minWidth: '30vw', minHeight: '40vh'}
        } else if ( this.size == 'sm') {
          css = {minWidth: '40vw', minHeight: '50vh'}
        } else if ( this.size == 'md') {
          css = {minWidth: '50vw', minHeight: '70vh'}
        } else if ( this.size == 'lg') {
          css = {minWidth: '70vw', minHeight: '80vh'}
        } else if ( this.size == 'xl') {
          css = {minWidth: '90vw', minHeight: '90vh'}
        }

        return css
      }
    },

    methods: {

      onValidBtnClick () {
        this.$emit('valid')
      },
      onCancelBtnClick () {
        this.$emit('cancel')
        this.hide()
      },
      onBtnClick (btn) {
        btn.onclick.call(this)
      },
      onCloseBtnClick () {
        this.$emit('cancel')
        this.hide()
      },

      hide () {
        if (this.$refs.modal)
          this.$refs.modal.hide()
      },
      show () {
        if (this.$refs.modal)
          this.$refs.modal.show()
      },
      toggle () {
        if (this.$refs.modal)
          this.$refs.modal.toggle()
      },
    }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

.no-shadow {
  -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}

</style>
