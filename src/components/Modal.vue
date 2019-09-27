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
    :maximized="__size==100"
  >
    <div class="column bg-white no-wrap" :style="__dimCss">

      <div class="col-auto bg-primary text-white q-py-sm q-px-md title">
        <div class="row items-center">
          <q-icon v-if="icon" :name="icon" left />
          <div v-if="title" class="text-h6">{{ title }}</div>
          <q-space/>
          <q-btn dense flat icon="close" @click="onCloseBtnClick">Close</q-btn>
        </div>
      </div>

      <div class="col scroll relative-position" :style="__contentDimCss">

        <div :class="__contentClass">
          <slot></slot>
        </div>

        <q-space/>

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

var sizes = {
  //      xs   sm   md   lg   xl
  'xs': [100, 100, 100, 100, 100],
  'sm': [ 70,  80, 100, 100, 100],
  'md': [ 60,  70,  80,  90, 100],
  'lg': [ 50,  60,  70,  80,  90],
  'xl': [ 25,  40,  50,  70,  90],
}

var sizeNames = ['xs', 'sm', 'md', 'lg', 'xl']

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

      __contentClass () {
        var cls = []
        if (!this.noContentPadding) cls.push('q-pa-md')
        return cls.join(' ')
      },

      __size () {
        for (var s in sizes) {
          if (this.$q.screen[s]) {
            var i = sizeNames.indexOf(this.size)
            return i!==-1 ? sizes[s][i] : 100
          }
        }
        return 100
      },

      __dimCss () {
        if (this.__size!=100) {
          return {
            width: this.__size+'%',
            maxWidth: this.__size+'vw'
          }
        }
      },

      __contentDimCss () {
        if (this.__size!=100) {
          return {
            maxHeight: '80vh',
          }
        }
      },
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
