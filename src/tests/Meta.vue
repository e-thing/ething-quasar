<template>
  <div>

    <resource-select
      v-model="resource"
      clearable
      label="Resource Filter"
      stack-label
    />


    <div v-if="resource" class="q-mt-lg">

      <div class="text-h6">{{ meta.title }} <small>[{{ resource.id() }}]</small></div>

      <div class="row q-col-gutter-md q-mt-md">

        <div class="col-xs-12 col-lg-3 q-gutter-y-md">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Category</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              {{ meta.category || 'none' }}
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Icon</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <q-avatar :color="meta.color" :icon="meta.icon" text-color="white" />
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Description</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="text-faded">
              {{ meta.description || 'no description' }}
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Badges</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <dynamic-component
                :component="badge"
                v-for="(badge, index) in badges" :key="index"
              />
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">MRO</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <div
                v-for="item in meta._dep" :key="item"
              >
                {{ item }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-lg-5 q-gutter-y-md">
          <q-card flat bordered class="my-card"
            v-for="(item, index) in componentsItems" :key="'component'+index"
          >
            <q-card-section>
              <span class="text-h6"><q-icon :name="item.icon" v-if="item.icon" /> Component: {{ item.title }}</span>
              <small class="q-ml-md">{{ item._id }}</small>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <dynamic-component
                :component="item"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-lg-4 q-gutter-y-md">
          <q-card flat bordered class="my-card"
            v-for="(widget, index) in widgets" :key="'widget'+index"
          >
            <q-card-section>
              <span class="text-h6"><q-icon :name="widget.icon" v-if="widget.icon" /> Widget: {{ widget.title }}</span>
              <small class="q-ml-md">{{ widget._id }}</small>
            </q-card-section>

            <q-card-section class="text-faded">
              {{ widget.description || 'no description' }}
            </q-card-section>

            <q-separator inset />

            <q-card-section>
              <widget
                :resource="resource"
                :widget="widget"
                title="$default"
                height="250px"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'TestMeta',

  data () {

    return {
      resource: null,
    }

  },

  computed: {

    __resourceId () {
      return this.resource ? this.resource.id() : null
    },

    meta () {
      return this.$ethingUI.get(this.resource)
    },

    badges () {
      var badges = Object.values(this.meta.badges)
      // re order by zIndex
      badges.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });
      return badges
    },

    componentsItems () {
      var components = Object.values(this.meta.components)
      // re order by zIndex
      components.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });
      return components
    },

    widgets () {
      var widgets = Object.values(this.meta.widgets)
      // re order by zIndex
      widgets.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });
      return widgets
    },
  },

}
</script>
