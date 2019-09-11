<template>
  <div class="column q-px-md q-pt-md no-wrap">
    <div class="col-auto cityname text-bold">
      {{ city }}
    </div>
    <q-space/>
    <div class="col-grow now row text-center" style="justify-content: space-evenly;">
      <div class="col-auto">
          <span class="value">{{ current.temperature }}</span>
          <span class="unit">{{ temperatureUnit }}</span>
      </div>
      <div class="col-auto">
        <q-icon class="icon" :name="current.weatherIcon"/>
        <div>
          {{ current.weatherLabel }}
        </div>
      </div>
    </div>
    <div class="col-shrink" v-if="today">
      <div class="today q-my-sm">
        <div class="text-bold">{{ today.day }}</div>
        <div class="row">
          <div class="col-4">
            <q-icon name="mdi-weather-sunset-up"/> {{ today.sunrise }}
          </div>
          <div class="col-3">
            Max {{ today.temperatureMax }}{{ temperatureUnit }}
          </div>
          <div class="col-5">
            <q-icon name="mdi-water"/> {{ today.humidity }} %
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <q-icon name="mdi-weather-sunset-down"/> {{ today.sunset }}
          </div>
          <div class="col-3">
            Min {{ today.temperatureMin }}{{ temperatureUnit }}
          </div>
          <div class="col-5">
            <q-icon name="mdi-scale"/> {{ today.pressure }} {{ pressureUnit }}
          </div>
        </div>
        <div class="row">
          <div class="col-5 offset-7">
            <q-icon name="mdi-weather-windy"/> {{ today.windDirection }} {{ today.windSpeed }} {{ windSpeedUnit }}
          </div>
        </div>
      </div>
      <template v-for="item in forecast" v-if="forecast && forecast.length>0">
        <q-separator/>
        <div class="forecast row q-my-sm">
          <div class="col-4 text-bold">
            {{ item.day }}
          </div>
          <div class="col-3">
            <q-icon class="icon" :name="item.weatherIcon"/>
          </div>
          <div class="col-3">
            {{ item.temperatureMax }}{{ temperatureUnit }}
          </div>
          <div class="col-2">
            {{ item.temperatureMin }}{{ temperatureUnit }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
    name: 'WWeatherForecast',

    props: {

    },

    data () {
      return {
        city: 'unknown',
        current: {
          temperature: 13,
          weatherIcon: 'mdi-weather-cloudy',
          weatherLabel: 'Partly Cloudy'
        },
        today: {
          day: 'Thursday',
          sunrise: '7:20 AM',
          sunset: '7:20 PM',
          temperatureMin: 3,
          temperatureMax: 13,
          humidity: 45,
          pressure: 1023,
          windDirection: 'NW',
          windSpeed: 20
        },
        forecast: [
          {
            day: 'Thursday',
            weatherIcon: 'mdi-weather-cloudy',
            temperatureMin: 3,
            temperatureMax: 13,
          },
          {
            day: 'Thursday',
            weatherIcon: 'mdi-weather-cloudy',
            temperatureMin: 3,
            temperatureMax: 13,
          },
          {
            day: 'Thursday',
            weatherIcon: 'mdi-weather-cloudy',
            temperatureMin: 3,
            temperatureMax: 13,
          },
        ],
        temperatureUnit: '°C',
        pressureUnit: 'mbar',
        windSpeedUnit: 'km/h'
      }
    },

    methods: {

    }

}
</script>

<style lang="stylus" scoped>

.light
  filter: brightness(110%)

.cityname
  font-size: 150%

.now .value
  font-size: 300%

.now .icon
  font-size: 400%

.today > .row
  font-size: 80%

</style>
