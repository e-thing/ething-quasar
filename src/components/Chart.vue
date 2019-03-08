<template>
  <div>
    <q-resize-observable @resize="onResize" />

    <highstock v-if="options" class="chart" :class="{ expended: expended }" :options="options" ref="highcharts"></highstock>

    <div v-else class="absolute-center text-center">
      <q-btn label="new plot" icon="timeline" @click="optionsModal = true" flat color="primary"/>
    </div>

    <q-inner-loading class="text-center" :visible="loading">
      <div class="q-pa-lg text-primary">loading...</div>
      <q-spinner-oval color="primary" size="50px" />
    </q-inner-loading>

    <modal v-model="saveModal" title="Chart save" icon="save" size="xs" valid-btn-label="Save" @valid="onSave" @show="$v.filename.$touch">

      <q-field label="Filename" class="q-my-md" orientation="vertical"
        :error="$v.filename.$error"
        error-label="Required"
      >
        <q-input v-model="filename" @input="$v.filename.$touch"/>
      </q-field>

    </modal>

    <modal v-model="optionsModal" size="lg" :no-esc-dismiss="!options" :no-backdrop-dismiss="!options" title="Chart options" icon="edit" :valid-btn-disable="$v.optionsData.$error" @valid="onOptionsValidate">

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
            @click="optionsData.panes.push({}); $v.optionsData.$touch()"
            label="Add pane"
            icon="add"
          />
        </div>

        <div class="q-ml-md q-mb-md">
          <div v-for="(pane, index) in optionsData.panes" :key="index" class="pane">
            <q-field
              label="name/unit"
              class="q-my-md"
              orientation="vertical"
              :error="$v.optionsData.panes.$each[index].name.$error"
              error-label="Required"
            >
              <q-input
                v-model="pane.name"
                @blur="$v.optionsData.panes.$each[index].name.$touch"
                :error="$v.optionsData.panes.$each[index].name.$error"
              />
            </q-field>

            <div class="q-my-md">
              <div class="q-subheading q-mb-md">
                Curves
                <q-btn flat size="md"
                  color="cyan-5"
                  @click="pane.curves.push({type:'line',  data:{}}); $v.optionsData.$touch()"
                  label="Add"
                  icon="add"
                />
              </div>

              <div class="q-ml-md q-mb-md">
                <div v-for="(curve, cindex) in pane.curves" :key="cindex" class="curve">
                  <q-field
                    label="name"
                    class="q-my-md"
                    orientation="vertical"
                    :error="$v.optionsData.panes.$each[index].curves.$each[cindex].name.$error"
                    error-label="Required"
                  >
                    <q-input
                      v-model="curve.name"
                      @blur="$v.optionsData.panes.$each[index].curves.$each[cindex].name.$touch"
                      :error="$v.optionsData.panes.$each[index].curves.$each[cindex].name.$error"
                    />
                  </q-field>

                  <q-field
                    label="type"
                    class="q-my-md"
                    orientation="vertical"
                    :error="$v.optionsData.panes.$each[index].curves.$each[cindex].type.$error"
                    error-label="Required"
                  >
                    <q-select
                      v-model="curve.type"
                      :options="serieTypeOptions"
                      @blur="$v.optionsData.panes.$each[index].curves.$each[cindex].type.$touch"
                      :error="$v.optionsData.panes.$each[index].curves.$each[cindex].type.$error"
                    />
                  </q-field>

                  <q-field
                    label="table"
                    class="q-my-md"
                    orientation="vertical"
                    :error="$v.optionsData.panes.$each[index].curves.$each[cindex].data.resource.$error"
                    error-label="Required"
                  >
                    <resource-select
                      type="resources/Table"
                      v-model="curve.data.resource"
                      use-id
                      @input="$v.optionsData.panes.$each[index].curves.$each[cindex].data.resource.$touch"
                      :error="$v.optionsData.panes.$each[index].curves.$each[cindex].data.resource.$error"
                    />
                  </q-field>

                  <q-field
                    v-if="curve.data.resource"
                    label="key"
                    class="q-my-md"
                    orientation="vertical"
                    :error="$v.optionsData.panes.$each[index].curves.$each[cindex].data.key.$error"
                    error-label="Required"
                  >
                    <q-select
                      v-model="curve.data.key"
                      :options="optionsBuildKeyOptions(curve, $v.optionsData.panes.$each[index].curves.$each[cindex].data.key)"
                      @input="$v.optionsData.panes.$each[index].curves.$each[cindex].data.key.$touch"
                      :error="$v.optionsData.panes.$each[index].curves.$each[cindex].data.key.$error"
                    />
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

    </modal>

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
    this.history = 'all' // 'all' or secondes
}

DataSource.prototype.clear = function () {
  this.sources = []
  this.history = 'all'
}

DataSource.prototype.setHistory = function (h) {
  this.history = h
}

DataSource.prototype.add = function (source, done) {
  var self = this
  var resource = EThing.arbo.get(source.resource)

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
          var r = EThing.arbo.get(this.resource)
          var query = null

          if (typeof self.history === 'number') {
            var d = new Date( Date.now() - (parseInt(self.history)*1000) )
						query = "date > dateTime('"+d.toISOString()+"')";
          }

          r.select({
            //datefmt: 'timestamp_ms',
            fields: ['date'].concat(this.keys),
            query
          }).then( data => {
            this.done.forEach( cb => {
                cb(data)
            })
          }).finally( () => {
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
        var date = new Date(d.date)
        var v = d[key]
        if (typeof v != 'number') {
          if (typeof v === 'string') v = parseFloat(d[key])
          else if (typeof v === 'boolean') v = v ? 1 : 0
        }
        return [date.getTime(), v]
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
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'Chart',

  props: {
    preferences: {},
    expended: Boolean,
    dense: Boolean,
    readonly: Boolean,
    history: {},
    chartOptions: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  components: {
    ResourceSelect
  },

  data () {
    var filename = ''
    var file = false

    if (typeof this.preferences === 'string') {
      var r = this.$ething.arbo.get(this.preferences)
      if (r instanceof this.$ething.File) {
        file = r
      }
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
      options: false,
      optionsModal: !(this.preferences),
      optionsData: {
        panes: [{
          curves: [{
            type:'line',
            data:{}
          }]
        }]
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
      file: file,
      table: null
    }
  },

  validations () {
    return {
      filename: {
        required
      },
      optionsData: {
        required,
        panes: {
          required,
          minLength: minLength(1),
          $each: {
            name: {
              required
            },
            curves: {
              required,
              minLength: minLength(1),
              $each: {
                name: {
                  required
                },
                type: {
                  required
                },
                data: {
                  required,
                  resource: {
                    required
                  },
                  key: {
                    required
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  methods: {
      load (preferences) {

        this.loading = true

        this.currentPreferences = extend(true, {}, preferences)

        this.dataSource.clear()

        this.dataSource.setHistory(this.history || preferences.history || 'all')

        var title = preferences.title
        if (this.dense && preferences.subtitle) {
          if (title) {
            title += ' - ' + preferences.subtitle
          } else {
            title = preferences.subtitle
          }
        }

        this.options = extend(true, {
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
                      menuItems: this.readonly ? ['refresh','separator','downloadPNG', 'downloadJPEG', 'downloadPDF'] : ['refresh','options','save','separator','downloadPNG', 'downloadJPEG', 'downloadPDF']
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
                selected: 1,
                enabled: !this.dense
            },
            tooltip: {
                xDateFormat: '%Y-%m-%d %H:%M',
                valueDecimals: 3
            },
            navigator: {
              enabled: !this.dense
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
                },
                series: {
                    animation: false
                }
            },
            series: [],
            yAxis: [],
            title: {
                text: title
            },
            subtitle: {
                text: this.dense ? null : preferences.subtitle
            },
            time: {
              useUTC: false
            }
        }, this.chartOptions)

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
                  // is it a boolean stream ?
                  var logicStream = true
                  for (var i in data) {
                    var v = data[i][1]
                    if (v!=0 && v!=1) {
                      logicStream = false
                      break
                    }
                  }

                  if (logicStream) {
                    serie.step = 'left'
                  }

                  // append the serie
                  this.options.series.push(serie)
                }
              }
            })


          })

        })

        this.dataSource.load( () => {
          this.loading = false
          //this.options = options
          // cleaning ...
          // todo: remove empty pane
        })

    },

    refresh () {
      this.loading = true
      this.dataSource.load(() => {
        this.loading = false
      })
    },

    onOptionsValidate () {
      this.load(this.optionsData)
      this.optionsModal = false
    },

    optionsBuildKeyOptions (curve) {
      var resource = this.$ething.arbo.get(curve.data.resource)
      if (resource) {
        var keys = resource.keys()
        if (keys.length) {
          this.$set(curve.data, 'key', keys[0])
        }
        return keys.map(key => {
          return {
            label: key,
            value: key
          }
        })
      }
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
            content: content
          }).then( (f) => {
            this.file = f
          })
        }
      }

      this.saveModal = false
    },

    chart () {
      return this.$refs.highcharts ? this.$refs.highcharts.chart : undefined
    },

    onResize (size) {
      // {
      //   width: 20 // width of container (in px)
      //   height: 50 // height of container (in px)
      // }
      this.resize()
    },

    resize: debounce( function () {
      var chart = this.chart()
      if (chart) chart.reflow()
    }, 1000),

    onTableUpdate (evt, updatedKeys) {
      if (updatedKeys.indexOf('contentModifiedDate') !== -1) {
        this.refresh()
      }
    }



  },

  mounted () {
    this.$v.optionsData.$touch()

    if (this.file) {
      this.file.read().then(data => {
        try{
          var preferences = typeof data === 'string' ? JSON.parse(data) : data;
          this.optionsData = preferences
          this.load(preferences)
        }
        catch(e){
          console.error('[chart] unable to load chart file', e)
        }
      })
    } else {

      var preferences = {}
      var resource = null

      if (typeof this.preferences === 'string') {
        resource = this.$ething.arbo.get(this.preferences)
      }
      if (this.preferences instanceof this.$ething.Table) {
        resource = this.$ething.arbo.get(this.preferences.id())
      }

      if (resource) {
        this.table = resource

        resource.on('updated', this.onTableUpdate)

        var createdBy = this.$ething.arbo.get(resource.createdBy())
        if (createdBy) {
          preferences.subtitle = '<a href="#' + this.$ethingUI.route(createdBy) + '">' + createdBy.basename() + '</a>'
        }
        preferences.title = '<a href="#' + this.$ethingUI.route(resource) + '">' + resource.basename() + '</a>'
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

      if (preferences) {
        this.optionsData = preferences
        this.load(preferences)
      }
    }

  },

  beforeDestroy () {
    if (this.table) {
      this.table.off('updated', this.onTableUpdate)
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
