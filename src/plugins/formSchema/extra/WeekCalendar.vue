<template>
  <form-schema-layout class="form-schema-week-calendar">

    <div v-if="c_value && c_value.length">
      <q-item dense v-for="(item, index) in c_value" :key="index">
        <q-item-side icon="schedule"/>
        <q-item-main>
          <q-item-tile label>{{ toString(item) }}</q-item-tile>
        </q-item-main>
      </q-item>
    </div>
    <div v-else class="q-ma-md text-faded">
      no scheduling
    </div>

    <q-btn
      color="blue-5"
      @click="modal=true"
      label="Select"
      icon="add"
      flat
    />

    <modal v-model="modal" title="Scheduler" icon="schedule" valid-btn-hide cancel-btn-label="Close" cancel-btn-color="faded">
      <div class="overflow-hidden">
        <div class="row gutter-xs non-selectable">
          <div class="col day" v-for="day in days">
            <div class="column">
              <div class="col-auto header q-py-md text-center">
                <span class="gt-xs">{{ day.name }}</span>
                <span class="xs">{{ printSmall(day.name) }}</span>
              </div>
              <div class="col-auto hour q-pa-xs" v-for="hour in day.hours" :class="{ selected: hour.selected }" @mousedown="select(hour)" @mouseover="mouseOver($event, hour)" @mouseup="updateValue">
                {{ hour.index }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'


const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default {
  name: 'FormSchemaWeekCalendar',

  mixins: [FormComponent],

  data () {
    return {
      days: this.fromValue(this.c_value),
      selectMode: true,
      modal: false
    }
  },

  methods: {
    select(hour) {
      hour.selected = !hour.selected;
      this.selectMode = hour.selected
    },
    mouseOver: function (e, hour) {
        if (e.buttons === 1) {
          hour.selected = this.selectMode
        }
    },

    updateValue () {
      var selections = []

      this.days.forEach( (day, i) => {

        var weekDay = i
        var selectedSaved = false
        var item = null

        day.hours.forEach( (hour) => {
          if (hour.selected != selectedSaved) {

            if (hour.selected) {
              item = {
                start: {
                  weekDay,
                  hour: hour.index
                }
              }
            } else {
              item.end = {
                weekDay,
                hour: hour.index
              }
              selections.push(item)
              item = null
            }
          }
          selectedSaved = hour.selected
        })

        if (item) {
          item.end = {
            weekDay,
            hour: 24
          }
          selections.push(item)
          item = null
        }
      })

      // console.log(selections)

      this.c_value = selections
    },

    inSelection (selections, weekDay, hour) {
      var serialize = (weekDay, hour) => (weekDay * 100 + hour)

      for (var i in selections) {
        var tStart = serialize(selections[i].start.weekDay, selections[i].start.hour)
        var tEnd = serialize(selections[i].end.weekDay, selections[i].end.hour)
        var t = serialize(weekDay, hour)

        if (t >= tStart && t < tEnd) return true
      }

      return false
    },

    fromValue (selections) {
      var days = weekDays.map((e, weekDay) => {
        return {
          name: e,
          hours: Array(24).fill(0).map((e, hour) => {
            return {
              index: hour,
              selected: selections ? this.inSelection(selections, weekDay, hour) : false
            }
          })
        }
      })

      return days
    },

    toString (item) {
      if (item.start.weekDay === item.end.weekDay) {
        return weekDays[item.start.weekDay] + ' ' + item.start.hour + 'h - ' + item.end.hour + 'h'
      } else {
        return weekDays[item.start.weekDay] + ' ' + item.start.hour + 'h - ' + weekDays[item.end.weekDay] + ' ' + item.end.hour + 'h'
      }
    },

    printSmall (str) {
      return str.substring(0, 3)
    }

  },

  mounted () {
    this.updateValue()
  }
}

</script>

<style lang="stylus" scoped>
  @import '~variables'

  .header
    color $primary

  .hour
    color $faded
    cursor pointer
    border-top 1px solid $light

    &:hover
      background-color $grey-2

    &.selected
      background-color $secondary
      color white

</style>
