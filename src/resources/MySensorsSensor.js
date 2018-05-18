export default {

  path: ['MySensors'],

  label: 'MySensors Sensor',

  properties: {
    sensorType: {
      enum: [
        'S_DOOR',
        'S_MOTION',
        'S_SMOKE',
        'S_LIGHT',
        'S_BINARY',
        'S_DIMMER',
        'S_COVER',
        'S_TEMP',
        'S_HUM',
        'S_BARO',
        'S_WIND',
        'S_RAIN',
        'S_UV',
        'S_WEIGHT',
        'S_POWER',
        'S_HEATER',
        'S_DISTANCE',
        'S_LIGHT_LEVEL',
        'S_ARDUINO_NODE',
        'S_ARDUINO_REPEATER_NODE',
        'S_LOCK',
        'S_IR',
        'S_WATER',
        'S_AIR_QUALITY',
        'S_CUSTOM',
        'S_DUST',
        'S_SCENE_CONTROLLER',
        'S_RGB_LIGHT',
        'S_RGBW_LIGHT',
        'S_COLOR_SENSOR',
        'S_HVAC',
        'S_MULTIMETER',
        'S_SPRINKLER',
        'S_WATER_LEAK',
        'S_SOUND',
        'S_VIBRATION',
        'S_MOISTURE',
        'S_INFO',
        'S_GAS',
        'S_GPS',
        'S_WATER_QUALITY',
        'S_CAM',
        'S_UNK',
      ]
    },

    createdBy: {
      filter: (r) => {
        return r.isTypeof('MySensorsNode')
      }
    }
  },

  dynamic (resource) {
    var widgets = []

    if (resource.attr('sensorType') === 'S_HUM') {
      widgets.push({
        type: 'WDeviceKnob',
        options: {
          fn: 'getHumidity',
          unit: '%'
        }
      })
      widgets.push({
        type: 'WDeviceLabel',
        options: {
          fn: 'getHumidity',
          unit: '%'
        }
      })
    }
    else if (resource.attr('sensorType') === 'S_BARO') {
      widgets.push({
        type: 'WDeviceLabel',
        options: {
          fn: 'getPressure',
          unit: 'Pa'
        }
      })
    }

    if (widgets.length) {
      return {
        widgets
      }
    }
  }

}
