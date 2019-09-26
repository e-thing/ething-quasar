<template>
  <div class="fit">
    <div ref="container" :class="__class" :style="__style">
      <component :is="__zoom ? 'v-zoomer' : 'div'" v-show="!error" style="width: 100%; height: 100%;">
        <img
          :key="key"
          :src="__url"
          style="object-fit: contain; width: 100%; height: 100%;"
          alt=""
          @load="onload"
          @error="onerror"
        >
      </component>
      <div class="absolute-top row items-center q-pa-sm" :style="__toolbarStyle">
        <div class="col text-subtitle1">
          <span v-if="!noTitle">{{ __data.title }}</span>
        </div>
        <div class="col-auto">
          <q-btn round flat icon="mdi-refresh" @click="refresh()" />
          <q-btn round flat :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="toggleFullscreen()" />
        </div>
      </div>
      <div v-show="loading" class="absolute-center">
        <q-circular-progress
          indeterminate
          size="48px"
        />
      </div>
      <div v-show="error" class="absolute-center text-negative">
        Unable to load the picture
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'ImageViewer',

  props: {
    /*
    source:
      - File or url
    */
    source: {},
    noTitle: Boolean,
    zoom: {
      type: String,
      default: 'both'
    },
    contentStyle: Object,
    contentClass: String,
    toolbarStyle: Object,
  },

  data() {
    return {
        fullscreen: false,
        key: 1,
        urlSuffix: '',
        loading: true,
        error: false,
    }
  },
  computed: {
    __data () {
      if (/^https?:\/\//.test(this.source)) {
        return {
          url: this.source,
          title: this.source
        }
      } else if (this.source instanceof this.$ething.File) {
        return {
          url: this.source.getContentUrl(false),
          title: this.source.name()
        }
      }
    },
    __url () {
      var url = this.__data.url
      return url + ( url.indexOf('?') === -1 ? '?' : '&' ) + this.urlSuffix
    },
    __zoom () {
      if (this.zoom === 'none') return false
      if (this.zoom === 'fullscreen') return this.fullscreen
      if (this.zoom === 'inline') return !this.fullscreen
      return true
    },
    __class () {
      var cls = this.fullscreen ? 'fullscreen' : 'relative-position fit'
      if (this.contentClass) {
        cls += ' ' + this.contentClass
      }
      return cls
    },
    __style () {
      var style = {
        'color': 'white',
        'background-color': '#2b2b2b'
      }

      if (!this.fullscreen && this.contentStyle) {
        Object.assign(style, this.contentStyle)
      }

      return style
    },
    __toolbarStyle () {
      var style = {
        'background': 'rgba(0,0,0,0.47)'
      }

      if (this.toolbarStyle) {
        Object.assign(style, this.toolbarStyle)
      }

      return style
    }
  },

  methods: {
    toggleFullscreen () {
    	this.fullscreen = !this.fullscreen

      if (this.fullscreen) {
        document.body.appendChild(this.$refs.container);
      } else {
        this.$el.appendChild(this.$refs.container);
      }
    },
    refresh () {
      this.loading = true
      this.error = false

      if (this.source instanceof this.$ething.File) {
        this.urlSuffix = '_ts=' + Date.now()
      } else {
        this.key += 1
      }
    },
    onload () {
      this.loading = false
    },
    onerror () {
      this.error = true
      this.loading = false
    },
  }

}
</script>
