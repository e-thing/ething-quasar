<template>

  <div>

    <div class="row cell">

      <div class="col-xs-12 col-sm-3 title text-bold">
        Schedule
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">

        <div class="text-faded">
          Select the schedule that the trigger should run on.
        </div>

        <q-list no-border>
          <q-item tag="label">
            <q-item-side>
              <q-radio v-model="model.schedule" val="daily" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Daily</q-item-tile>
              <q-item-tile sublabel>Allows you to configure a trigger that will run once, hourly or minutely daily</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item tag="label">
            <q-item-side>
              <q-radio v-model="model.schedule" val="weekly" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Days per week</q-item-tile>
              <q-item-tile sublabel>Allows you to configure a trigger that will run once, hourly or minutely on certain days of the week</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item tag="label">
            <q-item-side>
              <q-radio v-model="model.schedule" val="monthly" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Days per month</q-item-tile>
              <q-item-tile sublabel>Allows you to configure a trigger that will run on a specific date of the month or specific day of the week</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item tag="label">
            <q-item-side>
              <q-radio v-model="model.schedule" val="cron" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Cron expression</q-item-tile>
              <q-item-tile sublabel>Allows you to configure a trigger that will run according to the specific CRON expression</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>

      </div>

    </div>

    <div class="row cell" v-if="model.schedule == 'weekly'">

      <div class="col-xs-12 col-sm-3 title text-bold">
        Run Days
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">

        <div class="text-faded">
          Select what days of the week the scheduler should execute.
        </div>

        <div class="q-my-md">
          <q-checkbox class="q-mr-md q-my-sm" v-for="weekday in weekdays" :key="weekday" v-model="model.days" :val="weekday" :label="weekday" />
        </div>

      </div>

    </div>

    <div class="row cell" v-if="model.schedule == 'monthly'">

      <div class="col-xs-12 col-sm-3 title text-bold">
        On
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">

        <div class="text-faded">
          Select when in the month the trigger should execute
        </div>

        <q-list no-border>
          <q-item tag="label">
            <q-item-side>
              <q-radio v-model="model.on" val="day" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Specific date of every month</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item tag="label">
            <q-item-side>
              <q-radio v-model="model.on" val="weekday" />
            </q-item-side>
            <q-item-main>
              <q-item-tile label>Specific day of week of every month</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>

        <div v-if="model.on == 'day'">
          The
          <q-select
            v-model="model.onDay"
            :options="onMonthlyDaysOptions"
            hide-underline
            class="inline"
          />
          of every month
        </div>

        <div v-if="model.on == 'weekday'">
          The
          <q-select
            v-model="model.onWeekdayOrdinal"
            :options="[{label:'First', value: 1}, {label:'Second', value: 2}, {label:'Third', value: 3}, {label:'Fourth', value: 4}]"
            hide-underline
            class="inline"
          />
          <q-select
            v-model="model.onWeekday"
            :options="onMonthlyWeekdaysOptions"
            hide-underline
            class="inline"
          />
          of every month
        </div>

      </div>

    </div>

    <div class="row cell" v-if="model.schedule == 'daily' || model.schedule == 'weekly'">

      <div class="col-xs-12 col-sm-3 title text-bold">
        Interval
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">

        <q-select
          v-model="model.interval"
          :options="[{label:'Runs once', value: 'once'}, {label:'Every x hours', value: 'repeatHours'}, {label:'Every x minutes', value: 'repeatMinutes'}]"
          hide-underline
          class="inline"
        />

      </div>

    </div>

    <div class="row cell" v-if="model.schedule == 'monthly' || ((model.schedule == 'daily' || model.schedule == 'weekly') && model.interval=='once')">

      <div class="col-xs-12 col-sm-3 title text-bold">
        Start Time
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">

        Starting at
        <q-datetime
          v-model="model.startTime"
          type="time"
          format24h
          hide-underline
          class="inline"
        />

      </div>

    </div>

    <div class="row cell" v-if="(model.schedule == 'daily' || model.schedule == 'weekly') && (model.interval=='repeatHours' || model.interval=='repeatMinutes')">

      <div class="col-xs-12 col-sm-3 title text-bold">
        Repeat
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">
        Every
        <q-select
          v-model="model.every"
          :options="model.interval=='repeatHours' ? everyHoursOptions : everyMinutesOptions"
          hide-underline
          class="inline"
        />
        <span v-if="model.interval=='repeatHours'">
          hours
        </span>
        <span v-else>
          minutes
        </span>

      </div>

    </div>

    <div class="row cell" v-if="model.schedule == 'cron'">

      <div class="col-xs-12 col-sm-3 title text-bold">
        Cron Expression
      </div>

      <div class="col-xs-12 col-sm-9 cell-content">

        <div class="text-faded">
          Enter the cron expression to configure when the trigger shoud execute
        </div>

        <q-input class="q-my-md" v-model="model.cron" placeholder="min hour day month weekday" hide-underline float-label="Cron expression"/>

      </div>

    </div>

  </div>

</template>

<script>
import { date } from 'quasar'

export default {
    name: 'Cron',

    props: ['value'],

    data () {

      var everyHoursOptions = []
      for(var i=1; i<=12; i++)
        everyHoursOptions.push({label: String(i), value: i})

      var everyMinutesOptions = []
      for(var i=1; i<=59; i++)
        everyMinutesOptions.push({label: String(i), value: i})

      var onMonthlyDaysOptions = []
      for(var i=1; i<=31; i++)
        onMonthlyDaysOptions.push({label: String(i), value: i})

      var weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

      return {
        model: Object.assign ({
          schedule: "daily",
          interval: 'once',
          startTime: date.buildDate({ hours:15, minutes: 0 }),
          every: 1,
          days: [],
          on: 'day',
          onDay: 1,
          onWeekdayOrdinal: 1,
          onWeekday: 'monday',
          cron: this.value || '* 1 * * *',
        }, this.value ? this.unserialize(this.value) : null),

        weekdays,
        everyHoursOptions,
        everyMinutesOptions,
        onMonthlyWeekdaysOptions: weekdays.map(w => {
          return {
            label: w,
            value: w
          }
        }),
        onMonthlyDaysOptions,

        cron: ''
      }
    },

    watch: {
      'model': {
        handler () {
          this.cron = this.serialize()
        },
        deep: true,
        immediate: true,
      },

      'cron': {
        handler (val) {
          this.$emit('input', val)
        },
        immediate: true,
      }
    },

    methods: {

      weekdayToIndex (weekday) {
        var index = this.weekdays.indexOf(weekday) + 1
        if (index == 7) index = 0 // sunday = 0
        return index
      },

      indexToWeekday (index) {
        index = parseInt(index)
        if (index==0) index = 7
        return this.weekdays[index-1]
      },

      serialize () {
        var model = this.model

        if (model.schedule == 'cron') {
          return model.cron
        }

        if (model.schedule == 'daily' || model.schedule == 'weekly') {

          var days = '*'

          if (model.schedule == 'weekly') {

            days = model.days.map(weekday => this.weekdayToIndex(weekday)).join(',')

            if (!days) days = '*'
          }

          if (model.interval == 'once') {
            var hours = model.startTime.getHours()
            var minutes = model.startTime.getMinutes()
            return minutes + ' ' + hours + ' * * ' + days
          } else if (model.interval == 'repeatHours') {
            var every = model.every || 1
            if (every==1) return '0 * * * ' + days
            return '0 */' + every + ' * * ' + days
          } else if (model.interval == 'repeatMinutes') {
            var every = model.every || 1
            if (every==1) return '* * * * ' + days
            return '*/' + every + ' * * * ' + days
          }

        }

        if (model.schedule == 'monthly') {
          var hours = model.startTime.getHours()
          var minutes = model.startTime.getMinutes()

          if (model.on == 'day') {
            var day = model.onDay || 1
            return minutes + ' ' + hours + ' ' + day + ' * *'
          } else if (model.on == 'weekday') {
            var days = [ '1-7', '8-14', '15-21', '22-28' ]
            return minutes + ' ' + hours + ' ' + days[model.onWeekdayOrdinal-1] + ' * ' + this.weekdayToIndex(model.onWeekday)
          }
        }

      },

      unserialize (cron) {
        var model = {}
        var parts = cron.split(' ')
        var isNumber = /^[0-9]+$/
        var isStep = /^\*\/[0-9]+$/

        if (parts.length === 5) {

          if (isNumber.test(parts[0]) && isNumber.test(parts[1])) {
            model.startTime = date.buildDate({ hours: parseInt(parts[1]), minutes: parseInt(parts[0]) })
          }

          if (parts[2] == '*' && parts[3] == '*') {

            var schedule = 'daily'

            if (parts[4] != '*') {
              schedule = null

              if (/^[0-6](,[0-6])*$/.test(parts[4])) {
                schedule = 'weekly'
                model.days = parts[4].split(',').map(i => this.indexToWeekday(i))
              }
            }

            if (schedule) {
              if (isNumber.test(parts[0]) && isNumber.test(parts[1])) {
                model.schedule = schedule
                model.interval = 'once'
                return model
              }

              if (parts[0] == '0' && isStep.test(parts[1])) {
                model.schedule = schedule
                model.interval = 'repeatHours'
                model.every = parseInt(parts[1].substr(2))
                return model
              }

              if (parts[0] == '0' && parts[1] == '*') {
                model.schedule = schedule
                model.interval = 'repeatHours'
                model.every = 1
                return model
              }

              if (parts[1] == '*' && isStep.test(parts[0])) {
                model.schedule = schedule
                model.interval = 'repeatMinutes'
                model.every = parseInt(parts[0].substr(2))
                return model
              }

              if (parts[1] == '*' && parts[0] == '*') {
                model.schedule = schedule
                model.interval = 'repeatMinutes'
                model.every = 1
                return model
              }
            }

          }
          else if (parts[2] != '*' && parts[3] == '*') {

            if (isNumber.test(parts[2]) && parts[4] == '*') {
              model.schedule = 'monthly'
              model.on = 'day'
              model.onDay = parseInt(parts[2])
              return model
            }

            var days = [ '1-7', '8-14', '15-21', '22-28' ]
            if (/^[0-6]$/.test(parts[4]) && days.indexOf(parts[2]) !== -1) {
              model.schedule = 'monthly'
              model.on = 'weekday'
              model.onWeekdayOrdinal = days.indexOf(parts[2]) + 1
              model.onWeekday = this.indexToWeekday(parts[4])
              return model
            }


          }
        }

        model.schedule = 'cron'
        model.cron = cron

        return model

      }

    }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

.title
  line-height 24px

.cell
  &:not(:first-child)
    border-top 1px solid $grey-4
  padding-top $space-y-base
  padding-bottom $space-y-base

</style>
