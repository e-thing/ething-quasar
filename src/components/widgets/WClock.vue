<template>
  <div>
    <div class="absolute-center text-center">
      <div class="time">
          <span class="text-weight-bold">{{ hours }}:{{ minutes }} </span> <small style="filter: brightness(90%);">{{ seconds }}</small>
      </div>
      <span class="weekday" style="filter: brightness(90%);">
          {{ weekday }}
      </span>
    </div>
  </div>
</template>

<script>
import WWidget from './WWidget'
import {registerWidget} from '../../core/widget'

const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
]

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var c = {
    name: 'WClock',

    mixins: [WWidget],

    props: {
      // todo: timezone
    },

    data () {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        weekday: '',
        timerId: null
      }
    },

    mounted () {
      this.timerId = setInterval(() => {
        this.refreshTime()
      }, 1000)
    },

    beforeDestroy () {
      if(this.timerId !== null) {
        clearInterval(this.timerId)
      }
    },

    methods: {

      refreshTime () {
        var now = new Date()
        this.hours = pad(now.getHours(), 2)
        this.minutes = pad(now.getMinutes(), 2)
        this.seconds = pad(now.getSeconds(), 2)
        this.weekday = weekdays[now.getDay()]
      }
    },

}

registerWidget('clock', {
  component: c,
  title: 'clock',
  description: 'Display the time',
})

export default c
</script>
