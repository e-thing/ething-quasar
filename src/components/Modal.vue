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
    <div class="column bg-white" :style="Object.assign({}, widthCss, heightCss)">

      <div class="col-auto bg-primary text-white q-py-sm q-px-md title">
        <div class="row items-center">
          <q-icon v-if="icon" :name="icon" left />
          <div v-if="title" class="text-h6">{{ title }}</div>
          <q-space/>
          <q-btn dense flat icon="close" @click="onCloseBtnClick">Close</q-btn>
        </div>
      </div>

      <div class="col scroll">

        <div :class="noContentPadding ? '' : 'q-pa-md'">
          <slot></slot>
        </div>

        <div class="q-py-sm q-px-md buttons row items-center" v-if="!noButtons && scroll">

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

          <q-space/>

          <slot name="buttons-right"></slot>

        </div>

      </div>

      <div class="col-auto q-py-sm q-px-md buttons row items-center" v-if="!noButtons && !scroll">

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

        <q-space/>

        <slot name="buttons-right"></slot>

      </div>
    </div>
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

      scroll: Boolean,

      noContentPadding: Boolean,

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
        var height;

        if ( this.size == 'xs') {
          height = '40vh'
        } else if ( this.size == 'sm') {
          height = '50vh'
        } else if ( this.size == 'md') {
          height = '70vh'
        } else if ( this.size == 'lg') {
          height = '80vh'
        } else if ( this.size == 'xl') {
          height = '90vh'
        }

        return {height}
      },
      widthCss () {
        var width;

        if ( this.size == 'xs') {
          width = '30vw'
        } else if ( this.size == 'sm') {
          width = '40vw'
        } else if ( this.size == 'md') {
          width = '50vw'
        } else if ( this.size == 'lg') {
          width = '70vw'
        } else if ( this.size == 'xl') {
          width = '90vw'
        }

        return {width, maxWidth: width}
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

.title
  border-bottom 1px solid rgba(0,0,0,0.12)

.buttons
  border-top 1px solid rgba(0,0,0,0.12)

</style>
