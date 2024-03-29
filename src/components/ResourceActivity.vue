<template>
  <div class="q-px-md">
    <q-timeline layout="dense" v-if="items.length > 0">
      <q-timeline-entry
          v-for="(item, index) in items"
          :key="index"
          :subtitle="item.dateStr"
          color="secondary"
      >
        <template v-slot:title>
          <div class="text-secondary text-subtitle1"><q-icon v-if="item.icon" :name="item.icon"/> {{ item.title }}</div>
          <div v-if="multiple" class="text-purple text-subtitle2 cursor-pointer" @click="openResource(item.resource)">
            {{ item.resource.name() }}
          </div>
        </template>

        <div class="text-faded">
          {{ item.dataStr }}
        </div>
      </q-timeline-entry>
    </q-timeline>
    <div v-else class="q-pa-md text-center text-faded">No activity. Please wait...</div>
  </div>
</template>

<script>

export default {
  name: 'ResourceActivity',

  props: {
    source: {}, // either be a resource, a resource id, an array of resources, an array of resources ids
    historyLength: {
      type: Number,
      default: 20
    },
    reverse: Boolean
  },

  computed: {

    multiple () {
      return Array.isArray(this.source) && this.source.length > 1
    },

    items () {
      var events = []

      var sources = this.source
      if (!Array.isArray(sources)) sources = [sources]

      sources.forEach(source => {
        if (source instanceof this.$ething.Resource) {
          source = source.id()
        }
        var sourceEvents = this.$root.activityData[source]
        if (sourceEvents) {
          events = events.concat(sourceEvents)
        }
      })

      // sort by time
      events.sort((a, b) => {
        return a.timeStamp - b.timeStamp
      })

      if (this.historyLength>0) {
        events = events.slice(Math.max(events.length - this.historyLength, 0))
      }

      if (!this.reverse) {
        events.reverse()
      }

      return events.map(event => {
        var cls = this.$ethingUI.get(event.type) || {}

        return {
          title: cls.title || event.type,
          icon: cls.icon,
          dateStr: this.$ethingUI.utils.dateToString(event.timeStamp),
          dataStr: this.$ethingUI.utils.describe(event.data),
          ts: event.timeStamp,
          event,
          resource: event.resource
        }
      })
    }
  },

  methods: {
    openResource (resource) {
      this.$ethingUI.open(resource)
    }
  },

}
</script>
