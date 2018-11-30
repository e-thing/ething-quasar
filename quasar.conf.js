// Configuration for your app
var pjson = require('./package.json')
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (ctx) {

  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'ething-ui',
      'ething-quasar-core',
      'virtualKeyboard'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      'mdi',
      'fontawesome'
    ],
    supportIE: true,
    build: {
      publicPath: '/client',
      scopeHoisting: true,
      vueRouterMode: 'hash',
      env: {
        API: JSON.stringify(ctx.prod && ctx.mode.spa),
        VERSION: JSON.stringify(pjson.version)
      },
      // gzip: true,
      analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      vueCompiler: true,
      extendWebpack (cfg) {

        /*cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })*/

        cfg.plugins.push(new CopyWebpackPlugin([path.resolve(__dirname, './node_modules/ething-quasar-dll/dist/vendor.js')]))

        cfg.plugins.push(new webpack.DllReferencePlugin({
            context: path.join(__dirname, '.'),
            manifest: path.join(__dirname, "./node_modules/ething-quasar-dll/dist/vendor-manifest.json")
        }))
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QBtnDropdown',
        'QWindowResizeObservable',
        'QResizeObservable',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemSeparator',
        'QItemTile',
        'QItemMain',
        'QItemSide',
        'QBreadcrumbs',
        'QBreadcrumbsEl',
        'QTable',
        'QTableColumns',
        'QInnerLoading',
        'QSpinnerOval',
        'QSpinnerPie',
        'QField',
        'QInput',
        'QSelect',
        'QRadio',
        'QCheckbox',
        'QColor',
        'QDatetime',
        'QChipsInput',
        'QAutocomplete',
        'QSlider',
        'QToggle',
        'QKnob',
        'QCollapsible',
        'QModal',
        'QModalLayout',
        'QAlert',
        'QChip',
        'QPageSticky',
        'QFab',
        'QFabAction',
        'QPopover',
        'QOptionGroup',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardSeparator',
        'QCardActions',
        'QScrollArea',
        'QSearch'
        //
      ],
      directives: [
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Screen',
        'Notify',
        'Dialog',
        'LocalStorage',
        'SessionStorage',
        'ActionSheet',
        'Loading'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
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
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
        platform: 'all',
        arch: 'all'
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
