import '../statics/css/highlight.js.9.9.0.default.min.css'
import hljs from 'highlight.js/lib/highlight'

import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml' // includes html


hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)

var vueHighlightJS = {};

vueHighlightJS.install = function install(Vue) {

  Vue.directive('highlightjs', {
    deep: true,
    bind: function bind(el, binding) {
      // on first bind, highlight all targets
      var targets = el.querySelectorAll('code');
      var target;
      var i;

      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];

        if (typeof binding.value === 'string') {
          // if a value is directly assigned to the directive, use this
          // instead of the element content.
          target.textContent = binding.value;
        }

        hljs.highlightBlock(target);
      }
    },
    componentUpdated: function componentUpdated(el, binding) {
      // after an update, re-fill the content and then highlight
      var targets = el.querySelectorAll('code');
      var target;
      var i;

      for (i = 0; i < targets.length; i += 1) {
        target = targets[i];
        if (typeof binding.value === 'string') {
          target.textContent = binding.value;
        }
        hljs.highlightBlock(target);
      }
    }
  });
};

export default ({ Vue }) => {
    Vue.use(vueHighlightJS)
}
