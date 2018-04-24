<template>
  <div>
    <highcharts :options="options" ref="highcharts"></highcharts>
  </div>
</template>

<script>
import Vue from 'vue';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';

// load these modules as your need
import loadStock from 'highcharts/modules/stock';
// import loadMap from 'highcharts/modules/map';
// import loadDrilldown from 'highcharts/modules/drilldown';
// some charts like solid gauge require `highcharts-more.js`, you can find it in official demo.
// import loadHighchartsMore from 'highcharts/highcharts-more';
// import loadSolidGauge from 'highcharts/modules/solid-gauge';

loadStock(Highcharts);
// loadMap(Highcharts);
// loadDrilldown(Highcharts);
// loadHighchartsMore(Highcharts);
// loadSolidGauge(Highcharts);

Vue.use(VueHighcharts, { Highcharts });


function DataSource () {
    
    this.sources = []
    
}

DataSource.prototype.clear = function () {
    this.sources = []
}

DataSource.prototype.add = function (source, done) {
    
    var resource = EThing.arbo.findOneById(source.resource)
    
    if (resource instanceOf EThing.Table) {
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
                        datefmt: 'TIMESTAMP_MS',
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
            var formattedData = data.map(d => {
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



export default {
    name: 'Chart',

    props: ['preferences'],

    data () {
        return {
            loading: false,
            dataSource: new DataSource()
        }
    },
    
    methods: {
        load () {
            
            var preferences = this.preferences
            
            this.dataSource.clear()
            
            var options = {
                chart: {
                    plotBorderWidth: 1,
                    zoomType: 'x'
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
                responsive: {
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
                },
                xAxis: {
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
                    gridLineWidth: 1
                }
                
                options.yAxis.push(yAxis)
                
                pane.curves.forEach( (curve, index) => {
                    
                    var serie = {
                        showInNavigator: true,
                        type: curve.type || 'line',
                        name: curve.name || ('data '+index),
                        data: [],
                    }
                    
                    this.dataSource.add(curve.data, (data) => {
                        serie.data = data
                    })
                    
                    options.series.push(serie)
                    
                })
                
            })
            
            this.dataSource.load( () => {
                this.options = options
            })
            
        },
        
        refresh () {
            this.dataSource.load()
        }
        
    },
    
    mounted () {
        this.load()
    }


}
</script>
