// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
var pjson = require('./package.json')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'core',
      'vuelidate',
      'virtualKeyboard',
      'highlightjs',
      'ething-js',
      'formSchema',
      'axios'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QPageContainer',
        'QPage',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QAvatar',
        'QBadge',
        'QBanner',
        'QBtn',
        'QBtnGroup',
        'QBtnDropdown',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QChip',
        'QCircularProgress',
        'QColor',
        'QDialog',
        'QExpansionItem',
        'QField',
        'QInput',
        'QSelect',
        'QRadio',
        'QCheckbox',
        'QToggle',
        'QBtnToggle',
        'QOptionGroup',
        'QSlider',
        'QRange',
        'QTime',
        'QDate',
        'QIcon',
        'QImg',
        'QInnerLoading',
        'QKnob',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QMenu',
        'QResizeObserver',
        'QScrollObserver',
        'QPagination',
        'QPopupProxy',
        'QScrollArea',
        'QSeparator',
        'QSpace',
        'QSpinner',
        'QSpinnerOval',
        'QSpinnerPie',
        'QSplitter',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QTabPanels',
        'QTabPanel',
        'QTimeline',
        'QTimelineEntry',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
      ],

      directives: [
        'ClosePopup',
        'Ripple',
        'TouchHold',
        'TouchPan',
        'TouchSwipe',
      ],

      // Quasar plugins
      plugins: [
        'AddressbarColor',
        'AppFullscreen',
        'BottomSheet',
        'Dialog',
        'Loading',
        'LocalStorage',
        'SessionStorage',
        'Notify',
      ]
    },

    supportIE: false,

    build: {
      publicPath: '/client',
      scopeHoisting: true,
      vueRouterMode: 'hash',
      env: {
        API: JSON.stringify(ctx.prod && ctx.mode.spa),
        VERSION: JSON.stringify(pjson.version)
      },
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        if (!cfg.resolve) {
          cfg.resolve = {}
        }
        if (!cfg.resolve.alias) {
          cfg.resolve.alias = {}
        }

        cfg.resolve.alias['ething-ui'] = 'src/core'

        // comment below to disable eslint
        /*cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })*/
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'ething',
        // short_name: 'ething',
        // description: 'A IOT app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.ething.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'ething-ui'
      }
    }
  }
}
