# EThing UI


web app + mobile app + Electron app

based on [Quasar App](https://quasar-framework.org/).

## Installation

```
git clone https://github.com/e-thing/ething-quasar.git
cd ething-quasar
npm install
```

## Development

```
# run development server (with default theme)
$ quasar dev

# run development server with specific theme
$ quasar dev -t mat
$ quasar dev -t ios

# on specific port
$ quasar dev -p 9090

# PWA
$ quasar dev -m pwa

# Mobile App
$ quasar dev -m cordova -T [android|ios] -t [mat|ios]

# Electron App
$ quasar dev -m electron
# with iOS theme...
$ quasar dev -m electron -t ios
```

## Build

```
# build for production
$ quasar build

# build for production with specific theme
$ quasar build -t mat
$ quasar build -t ios

# PWA
$ quasar build -m pwa

# Mobile App
$ quasar build -m cordova -T [android|ios] -t [mat|ios]

# Electron App
$ quasar build -m electron
# with iOS theme...
$ quasar build -m electron -t ios
```
