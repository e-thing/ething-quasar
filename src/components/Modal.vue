<template>
  <q-dialog
    ref="modal"
    class="column"
    :value="value"
    @input="$emit('input', $event)"
    v-bind="$attrs"
    @show="$emit('show', $event)"
    @escape-key="$emit('cancel')"
    @dismiss="$emit('cancel')"
  >
    <q-card :style="widthCss">

      <q-card-section class="bg-primary text-white">
        <div class="row items-center">
          <q-icon v-if="icon" :name="icon" left />
          <div v-if="title" class="text-h6">{{ title }}</div>
          <q-space/>
          <q-btn dense flat icon="close" @click="onCloseBtnClick">Close</q-btn>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section :style="heightCss" class="scroll q-px-none">

        <div class="q-px-md">
          <slot ></slot>
        </div>

        <template v-if="!noButtons">
          <q-separator />

          <q-card-actions align="right">

            <q-btn
              v-if="!validBtnHide"
              :color="validBtnColor"
              @click="onValidBtnClick()"
              :label="validBtnLabel"
              :disable="validBtnDisable"
              :loading="validBtnLoading"
              flat
            />

            <q-btn
              v-if="!cancelBtnHide"
              :color="cancelBtnColor"
              @click="onCancelBtnClick()"
              :label="cancelBtnLabel"
              :disable="cancelBtnDisable"
              flat
            />

            <q-btn
              v-for="(btn, index) in buttons" :key="index"
              :color="btn.color"
              @click="onBtnClick(btn)"
              :label="btn.label"
              :flat="btn.flat"
              :disable="btn.disable"
            />

            <slot name="buttons"></slot>

          </q-card-actions>
        </template>
      </q-card-section>

    </q-card>
  </q-dialog>
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
      heightCss () {
        var css = {}

        if ( this.size == 'xs') {
          css = {maxHeight: '40vh'}
        } else if ( this.size == 'sm') {
          css = {maxHeight: '50vh'}
        } else if ( this.size == 'md') {
          css = { maxHeight: '70vh'}
        } else if ( this.size == 'lg') {
          css = {maxHeight: '80vh'}
        } else if ( this.size == 'xl') {
          css = {maxHeight: '90vh'}
        }

        return css
      },
      widthCss () {
        var css = {}

        if ( this.size == 'xs') {
          css = {maxWidth: '30vw', width: '30vw'}
        } else if ( this.size == 'sm') {
          css = {maxWidth: '40vw', width: '40vw'}
        } else if ( this.size == 'md') {
          css = {maxWidth: '50vw', width: '50vw'}
        } else if ( this.size == 'lg') {
          css = {maxWidth: '70vw', width: '70vw'}
        } else if ( this.size == 'xl') {
          css = {maxWidth: '90vw', width: '90vw'}
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


.no-shadow {
  -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}

</style>
