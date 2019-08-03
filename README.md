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

# on specific port
$ quasar dev -p 9090

# PWA
$ quasar dev -m pwa

# Mobile App
$ quasar dev -m cordova -T [android|ios]

# Electron App
$ quasar dev -m electron
```

## Build

```
# build for production
$ quasar build

# PWA
$ quasar build -m pwa

# Mobile App
$ quasar build -m cordova -T [android|ios]

# Electron App
$ quasar build -m electron
```
