<template>
  <vue-touch-keyboard
    v-if="visible"
    :layout="layout"
    :cancel="hide"
    :accept="accept"
    :change="change"
    :next="next"
    :input="input"
    :options="options"
    class="vkeyboard"
  />
</template>

<script>

import VueTouchKeyboard from "vue-touch-keyboard";
import VueTouchKeyboardStyle from "vue-touch-keyboard/dist/vue-touch-keyboard.css"; // load default style

import { dom } from 'quasar'
const { style } = dom


var keyboard = null;

var focusHandler = function(event) {
  if (!keyboard) return // no keyboard installed !

  console.log('install vkeyboard')

  var nodetype = event.target.nodeName.toLowerCase();
  if(nodetype == 'input' || nodetype == 'textarea') {

      var input = event.target
      var layout = null

      if (nodetype == 'input') {
        var inputType = input.getAttribute("type")

        switch (inputType) {
          case 'number': {
            layout = "numeric"
            break
          }
        }
      }

      keyboard.show(input, layout)
  }
};

var install = function (kb) {
  if (keyboard) return

  keyboard = kb
  if (document.body.addEventListener) {
    document.body.addEventListener('focus', focusHandler, true); //Non-IE
  } else {
    document.body.onfocusin = focusHandler; //IE
  }
}

var uninstall = function (kb) {
  if (!keyboard) return

  keyboard = null
  if (document.body.addEventListener) {
    document.body.removeEventListener('focus', focusHandler, true); //Non-IE
  } else {
    document.body.onfocusin = null; //IE
  }
}


export default {
    name: 'VKeyboard',

    components: {
      'vue-touch-keyboard': VueTouchKeyboard.component
    },

    data () {
        return {
          visible: false,
          layout: "normal",
          input: null,

          options: {
            useKbEvents: false,
            preventClickEvent: true
          }
        }
    },

    methods: {

      accept(text) {
        this.hide();
      },

      show(input, layout) {
        this.input = input;
        this.layout = input.dataset.layout || layout || 'normal';

        if (!this.visible)
          this.visible = true
      },

      hide() {
        this.visible = false;
      },

      change (text, addChar) {

        let e = new InputEvent('input', {
          data: text,
          bubbles: true,
          cancelable: true
        });

        this.input.dispatchEvent(e)
      },

      next() {
				let inputs = document.querySelectorAll("input");
				let found = false;

        // filter only visible inputs
        inputs = [].filter.call(inputs, item => style(item, 'display') !== 'none')

				inputs.forEach((item, i) => {
					if (!found && item == this.input && i < inputs.length - 1) {
						found = true;
						this.$nextTick(() => {
							inputs[i+1].focus();
						});
					}
				});
				if (!found) {
					this.input.blur();
					this.hide();
				}
			}

    },

    mounted () {
      install(this)
    },

    beforeDestroy () {
      uninstall(this)
    }

}
</script>

<style lang="stylus">

.vkeyboard
  position fixed
  bottom 0px
  left 0px
  right 0px
  z-index 1000
  width 100%
  max-width 1000px
  margin 0 auto
  padding 1em
  background-color #EEE
  box-shadow 0px -3px 10px rgba(black, 0.3)
  border-radius 10px

</style>
