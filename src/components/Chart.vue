<template>
  <div>
    <q-resize-observable @resize="onResize" />

    <highstock class="chart" :class="{ expended: expended }" :options="options" ref="highcharts"></highstock>

    <q-modal v-model="saveModal" :content-css="{padding: '50px', minWidth: '50vw'}">

      <div class="q-display-1 q-mb-md">Chart save</div>

      <q-field label="Filename" class="q-my-md" orientation="vertical">
        <q-input v-model="filename" />
      </q-field>

      <q-btn
        color="primary"
        @click="onSave"
        label="Save"
      />
      <q-btn
        color="negative"
        @click="saveModal = false"
        label="Cancel"
      />

    </q-modal>

    <q-modal v-model="optionsModal" :content-css="{padding: '50px', minWidth: '50vw'}">
      <div class="q-display-1 q-mb-md">Chart options</div>

      <q-field label="Title" class="q-my-md" orientation="vertical">
        <q-input v-model="optionsData.title" />
      </q-field>

      <q-field label="Subtitle" class="q-my-md" orientation="vertical">
        <q-input v-model="optionsData.subtitle" />
      </q-field>

      <div class="q-my-md">
        <div class="q-subheading q-mb-md">
          Panes
          <q-btn flat size="md"
            color="blue-5"
            @click="optionsData.panes.push({})"
            label="Add pane"
            icon="add"
          />
        </div>

        <div class="q-ml-md q-mb-md">
          <div v-for="(pane, index) in optionsData.panes" :key="index" class="pane">
            <q-field label="name/unit" class="q-my-md" orientation="vertical">
              <q-input v-model="pane.name" />
            </q-field>

            <div class="q-my-md">
              <div class="q-subheading q-mb-md">
                Curves
                <q-btn flat size="md"
                  color="cyan-5"
                  @click="pane.curves.push({})"
                  label="Add"
                  icon="add"
                />
              </div>

              <div class="q-ml-md q-mb-md">
                <div v-for="(curve, cindex) in pane.curves" :key="cindex" class="curve">
                  <q-field label="name" class="q-my-md" orientation="vertical">
                    <q-input v-model="curve.name" />
                  </q-field>

                  <q-field label="type" class="q-my-md" orientation="vertical">
                    <q-select v-model="curve.type" :options="serieTypeOptions"/>
                  </q-field>

                  <q-field label="table" class="q-my-md" orientation="vertical">
                    <resource-select type="Table" v-model="curve.data.resource" use-id/>
                  </q-field>

                  <q-field label="key" class="q-my-md" orientation="vertical">
                    <q-select v-model="curve.data.key" :options="optionsBuildKeyOptions(curve.data.resource)"/>
                  </q-field>

                  <q-btn flat size="md"
                    color="negative"
                    @click="pane.curves.splice(cindex, 1)"
                    label="remove"
                    icon="delete"
                  />

                </div>
              </div>
            </div>
            <q-btn flat size="md"
              color="negative"
              @click="optionsData.panes.splice(index, 1)"
              label="remove"
              icon="delete"
            />
          </div>
        </div>

      </div>

      <q-btn
        color="primary"
        @click="onOptionsValidate"
        label="Validate"
      />
      <q-btn
        color="negative"
        @click="optionsModal = false"
        label="Cancel"
      />
    </q-modal>

  </div>
</template>

<script>
import EThing from 'ething-js'
import Vue from 'vue'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'

// load these modules as your need
import loadStock from 'highcharts/modules/stock'
// import loadMap from 'highcharts/modules/map';
// import loadDrilldown from 'highcharts/modules/drilldown';
// some charts like solid gauge require `highcharts-more.js`, you can find it in official demo.
// import loadHighchartsMore from 'highcharts/highcharts-more';
// import loadSolidGauge from 'highcharts/modules/solid-gauge';
import loadHighchartsExporting from 'highcharts/modules/exporting';

loadStock(Highcharts);
// loadMap(Highcharts);
// loadDrilldown(Highcharts);
// loadHighchartsMore(Highcharts);
// loadSolidGauge(Highcharts);
loadHighchartsExporting(Highcharts);

Vue.use(VueHighcharts, { Highcharts });

function DataSource () {
    this.sources = []
}

DataSource.prototype.clear = function () {
  this.sources = []
}

DataSource.prototype.add = function (source, done) {

  var resource = EThing.arbo.findOneById(source.resource)

  if (resource instanceof EThing.Table) {
    var s = null
    var key = source.key

    for(var i in this.sources){
      if (this.sources[i].resource === resource.id()) {
        s = this.sources[i]
        break
      }
    }

    if (!s) {
      s = {
        resource: resource.id(),
        keys: [],
        done: [],
        fetch: function (end) {
          var r = EThing.arbo.findOneById(this.resource)
          r.select({
            datefmt: 'timestamp_ms',
            fields: ['date'].concat(this.keys),
          }).done( data => {
            this.done.forEach( cb => {
                cb(data)
            })
          }).always( () => {
            end()
          })
        }
      }

      this.sources.push(s)
    }

    s.keys.push(key)
    s.done.push((data) => {
      var formattedData = data.filter(d => {
        return d.hasOwnProperty(key)
      }).map(d => {
        return [d.date, d[key]]
      })

      done(formattedData)
    })
  }
}

DataSource.prototype.load = function (done) {
  var wait = this.sources.length

  function end () {
    wait--
    if (wait === 0) {
      if (typeof done === 'function') done()
    }
  }

  this.sources.forEach( source => {
    source.fetch.call(source, end)
  })
}

import { extend } from 'quasar'
import ResourceSelect from './ResourceSelect'
import { debounce } from 'quasar'

export default {
  name: 'Chart',

  props: {
    preferences: {},
    expended: Boolean
  },

  components: {
    ResourceSelect
  },

  data () {
    var filename = ''
    var file = false

    if (typeof this.preferences === 'string') {
      file = this.$ething.arbo.findOneById(this.preferences)
    }
    else if (this.preferences instanceof this.$ething.File) {
      file = this.preferences
    }

    if (file) {
      filename = file.name()
    }

    return {
      loading: false,
      dataSource: new DataSource(),
      options: {},
      optionsModal: !(this.preferences),
      optionsData: {
        panes: []
      },
      serieTypeOptions: [
        {
          label: 'line',
          value: 'line'
        },
        {
          label: 'column',
          value: 'column'
        },
        {
          label: 'scatter',
          value: 'scatter'
        },
        {
          label: 'area',
          value: 'area'
        },
        {
          label: 'spline',
          value: 'spline'
        }
      ],
      saveModal: false,
      filename: filename,
      file: file
    }
  },

  methods: {
      load (preferences) {

        this.currentPreferences = extend(true, {}, preferences)

        this.dataSource.clear()

        this.options = {
            chart: {
              plotBorderWidth: 1,
              zoomType: 'x'
            },
            exporting: {
              menuItemDefinitions: {
                refresh: {
                  onclick: () => {
                    this.refresh()
                  },
                  text: 'refresh'
                },
                options: {
                  onclick: () => {
                    this.optionsModal = true
                  },
                  text: 'options'
                },
                save: {
                  onclick: () => {
                    if (this.currentPreferences) {
                      this.saveModal = true
                    }
                  },
                  text: 'save'
                },
              },
              buttons: {
                  contextButton: {
                      menuItems: ['refresh','options','save','separator','downloadPNG', 'downloadJPEG', 'downloadPDF']
                  }
              }
            },
            rangeSelector: {
                buttons: [{
                    type: 'hour',
                    count: 12,
                    text: '12h'
                },{
                    type: 'day',
                    count: 1,
                    text: '1d'
                },{
                    type: 'week',
                    count: 1,
                    text: '1w'
                },{
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 1
            },
            tooltip: {
                xDateFormat: '%Y-%m-%d %H:%M'
            },
            /*responsive: {
                rules: [{
                    condition: {
                        maxHeight: 400
                    },
                    chartOptions: {
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },*/
            xAxis: {
                type: 'datetime',
                ordinal: false,
                tickLength: 5
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                column: {
                    dataGrouping: {
                        approximation: "average"
                    }
                }
            },
            series: [],
            yAxis: [],
            title: {
                text: preferences.title
            },
            subtitle: {
                text: preferences.subtitle
            },
        }

        var marge = 5; // vertical space between 2 panes (in %)
        var paneHeight = (100-(preferences.panes.length-1)*marge)/preferences.panes.length; // in %

        preferences.panes.forEach( (pane, index) => {
          var yAxisId = 'axis-'+index
          var yAxis = {
            title: {
                text: pane.name || ''
            },
            resize: {
                enabled: true
            },
            height: paneHeight+'%',
  					top: (index*(paneHeight+marge))+'%',
  					offset: 0,
            labels: {
                align: 'right',
                x: -3,
                y: 4
            },
            lineWidth: 1,
            opposite: false,
            showLastLabel: true,
            gridLineWidth: 1,
            id: yAxisId
          }

          this.options.yAxis.push(yAxis)

          pane.curves.forEach( (curve, index) => {
            var serie = {
                showInNavigator: true,
                type: curve.type || 'line',
                name: curve.name || ('data '+index),
                data: [],
                yAxis: yAxisId
            }

            this.dataSource.add(curve.data, (data) => {
              if (data.length) {
                serie.data = data

                if (this.options.series.indexOf(serie) === -1) {
                  // append the serie
                  this.options.series.push(serie)
                }
              }
            })


          })

        })

        this.dataSource.load( () => {
          console.log('dataSource.loaded')
          //this.options = options
          // cleaning ...
          // todo: remove empty pane
        })

    },

    refresh () {
        this.dataSource.load()
    },

    onOptionsValidate () {
      this.load(this.optionsData)
      this.optionsModal = false
    },

    optionsBuildKeyOptions (resourceId) {
      return this.$ething.arbo.findOneById(resourceId).keys().map(key => {
        return {
          label: key,
          value: key
        }
      })
    },

    onSave () {
      var content = JSON.stringify(this.currentPreferences, null, 4)

      if (!/\.plot$/.test(this.filename)) {
        this.filename = this.filename + '.plot'
      }

      if (this.file && this.file.name() === this.filename) {
        // overwrite
        this.file.write( content )
      } else {
        // create a new file with the given name
        if (this.filename.length) {
          this.$ething.File.create({
            name: this.filename,
            content: btoa(content)
          }).done( (f) => {
            this.file = f
          })
        }
      }
    },

    chart () {
      return this.$refs.highcharts.chart
    },

    onResize (size) {
      // {
      //   width: 20 // width of container (in px)
      //   height: 50 // height of container (in px)
      // }
      // this.chart().reflow()
      this.resize()
    },

    resize: debounce( function () {
      this.chart().reflow()
    }, 1000)

  },

  mounted () {
    if (this.file) {
      this.file.read().done(data => {
        try{
          var preferences = JSON.parse(data);
          this.optionsData = preferences
          this.load(preferences)
        }
        catch(e){}
      })
    } else {

      var preferences = {}

      if (this.preferences instanceof this.$ething.Table) {
        var resource = this.preferences
        var createdBy = this.$ething.arbo.findOneById(resource.createdBy())
        if (createdBy) {
          preferences.subtitle = createdBy.basename()
        }
        preferences.title = resource.basename()
        preferences.panes = []

        resource.keys().forEach( key => {
          var pane = {
            name: key,
            curves: [{
              name: key,
              type: 'line',
              data: {
                resource: resource.id(),
                key: key
              }
            }]
          }
          preferences.panes.push(pane)
        })
      } else {
        preferences = this.preferences
      }

      this.optionsData = preferences
      this.load(preferences)
    }

  }


}
</script>

<style lang="stylus" scoped>
@import '~variables'

border-width = 3px

.pane
  border-left border-width solid $blue-3
  &:hover
    border-left border-width solid $blue-5
  padding-left 10px

.curve
  border-left border-width solid $cyan-3
  &:hover
    border-left border-width solid $cyan-5
  padding-left 10px

.chart.expended
  height 100%
  width 100%
  position absolute

</style>
