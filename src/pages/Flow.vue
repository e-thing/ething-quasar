<template>
  <q-page>

    <div class="topMenu">
      <q-btn label="deploy" flat :color="dirty?'primary':'faded'" @click="deploy" />
    </div>

    <div class="leftMenu">
      <div v-for="node in meta.nodes" :key="node.type">
        <drag :transfer-data="{node}">
          <q-btn flat :icon="node.icon || 'mdi-puzzle'" align="left" :style="{color: node.color}" :label="node.type" @click="addNodeClick(node.type)" class="full-width"/>
        </drag>
      </div>
    </div>

    <div class="main">
      <drop @drop="handleDrop">
        <div ref="flowchart" class="flowchart jtk-surface jtk-surface-nopan">
            <div ref="node" class="node" :class="node.type" :style="{'border-color': node.color}" v-for="node in nodes" :key="node.id" :data-id="node.id">
              <strong>{{ nodeTitle(node) }}</strong>
              <q-btn flat dense icon="edit" size="sm" color="faded"  @click="editNode(node)" />
              <q-btn flat dense icon="delete" size="sm" color="faded"  @click="removeNode(node)" />
            </div>
        </div>
      </drop>
    </div>

    <modal v-model="edit.show" :title="(edit.node?'Edit':'Add')+' '+edit.type" icon="add" :valid-btn-disable="edit.error" valid-btn-label="Add" @valid="onEditDone">
      <form-schema :key="edit.key" :schema="edit.schema" v-model="edit.model" @error="edit.error = $event"/>
    </modal>

  </q-page>
</template>

<script>

//var jsPlumb = require("jsplumb")
import { jsPlumb } from 'jsplumb'
import 'jsplumb/css/jsplumbtoolkit-defaults.css'

import { Drag, Drop } from 'vue-drag-drop'


var basicType = {
    connector: "StateMachine",
    paintStyle: { stroke: "red", strokeWidth: 4 },
    hoverPaintStyle: { stroke: "blue" },
    overlays: [
        "Arrow"
    ]
};

// this is the paint style for the connecting lines..
var connectorPaintStyle = {
        strokeWidth: 2,
        stroke: "#61B7CF",
        joinstyle: "round",
        outlineStroke: "white",
        outlineWidth: 2
    },
// .. and this is the hover style.
    connectorHoverStyle = {
        strokeWidth: 3,
        stroke: "#216477",
        outlineWidth: 5,
        outlineStroke: "white"
    },
    endpointHoverStyle = {
        fill: "#216477",
        stroke: "#216477"
    },
// the definition of source endpoints (the small blue ones)
    sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
            stroke: "#7AB02C",
            fill: "transparent",
            radius: 7,
            strokeWidth: 1
        },
        maxConnections: -1,
        isSource: true,
        connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        overlays: [
            [ "Label", {
                location: [0.5, 1.5],
                label: "Drag",
                cssClass: "endpointSourceLabel",
                visible:false
            } ]
        ]
    },
// the definition of target endpoints (will appear when the user drags a connection)
    targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: "#7AB02C", radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        overlays: [
            [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
        ]
    },
    init = function (connection) {
        //connection.getOverlay("label").setLabel(connection.source.getAttribute('data-id') + "-" + connection.target.getAttribute('data-id'));
    };


export default {
  name: 'PageFlow',

  components: {
    Drag, Drop
  },

  data () {

    return {
      instance: null,
      nodes: [],
      edit: {
        type: null,
        show: false,
        model: undefined,
        error: false,
        node: null,
        schema: {},
        key: 0,
        extra: null
      },
      meta: {},
      dirty: false
    }

  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/get'](id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }

      return r
    },

  },

  methods: {

    handleDrop (data, event) {
      var node = data.node
      this.addNodeClick(node.type, {
        x: event.offsetX - 80,
        y: event.offsetY - 30
      })
    },

    deploy () {
      var flow = this.exportFlow()
      if (flow) {
        this.resource.set({
          flow
        }, () => {
          this.dirty = false
          this.resource.deploy()
        })
      }
    },

    demo () {
      this.addNodesToFlow([
        {id:'1', type:'event', model:{type:'events/CustomEvent', name:'toto'}, x:250, y:300},
        {id:'2', type:'action', model:{type:'actions/Wait', duration:1000}, x:550, y:300}
      ], () => {
        this.instance.connect({uuids: ['1.outputs.default', '2.inputs.default'], editable: true});
      })

    },

    addNodesToFlow (nodes, done) {
      var i = nodes.length;
      if (!i) {
        if (done) done(nodes)
        return
      }
      function cb() {
        i--
        if (i<=0) {
          if (done) {
            done(nodes)
          }
        }
      }
      nodes.forEach(n => {
        this.addNodeToFlow(n, cb)
      })
    },

    addNodeToFlow (node, done) {
      if (!this.instance) return

      if (typeof node.id === 'undefined')
        node.id = this.getId()

      if (typeof node.type === 'undefined')
        throw 'no node.type defined'

      var type = node.type
      var cls = this.getNodeCls(type)

      if (!cls) {
        console.warn('unknown node type ' + type);
        if (done) done(null)
        return
      }

      if (typeof node.color === 'undefined')
        node.color = cls.color

      if (typeof node.x === 'undefined')
        node.x = 0
      if (typeof node.x === 'number')
        node.x = node.x+'px'

      if (typeof node.y === 'undefined')
        node.y = 0
      if (typeof node.y === 'number')
        node.y = node.y+'px'

      this.nodes.push(node)

      this.$nextTick(() => {
        var el = this.getNodeElement(node.id)

        node.el = el

        el.style.left = node.x
        el.style.top = node.y

        this.instance.batch(() => {

          // inputs
          if (cls.inputs) {
            cls.inputs.forEach((input, index) => {
              this.instance.addEndpoint(el, targetEndpoint, {
                  anchor: "ContinuousLeft",
                  uuid: node.id + ".inputs." + input
              });
            })
          }

          // outputs
          if (cls.outputs) {
            cls.outputs.forEach((output, index) => {
              this.instance.addEndpoint(el, sourceEndpoint, {
                  anchor: "ContinuousRight",
                  uuid: node.id + ".outputs." + output
              });
            })
          }
          /*
          if (node.type == 'event') {
            this.instance.addEndpoint(el, sourceEndpoint, {
                anchor: "RightMiddle",
                uuid: node.id + ".outputs.default"
            });
          }
          else if (node.type == 'condition') {
            this.instance.addEndpoint(el, sourceEndpoint, {
                anchor: "RightMiddle",
                uuid: node.id + ".outputs.default"
            });
            this.instance.addEndpoint(el, sourceEndpoint, {
                anchor: "BottomCenter",
                uuid: node.id + ".outputs.fail"
            });
            this.instance.addEndpoint(el, targetEndpoint, {
                anchor: "LeftMiddle",
                uuid: node.id + ".inputs.default"
            });
          }
          else if (node.type == 'action') {
            this.instance.addEndpoint(el, sourceEndpoint, {
                anchor: "RightMiddle",
                uuid: node.id + ".outputs.default"
            });
            this.instance.addEndpoint(el, targetEndpoint, {
                anchor: "LeftMiddle",
                uuid: node.id + ".inputs.default"
            });
          }
          */

          this.instance.draggable(el, {
            grid: [20, 20],
            stop: (event, ui) => {
              this.dirty = true
            }
          });

          if (done) done(node)
        })
      })

    },

    removeNodeToFlow (node) {
      if (typeof node !== 'string')
        node = node.id

      var el = this.getNodeElement(node)
      var endpoints = this.instance.getEndpoints(el)

      endpoints.forEach(ep => {
        this.instance.deleteEndpoint(ep)
      })

      for(var i in this.nodes) {
        if (this.nodes[i].id === node) {
          this.nodes.splice(i, 1)
          break
        }
      }

    },

    removeNode (node) {
      this.removeNodeToFlow(node)
      this.dirty = true
    },

    getId () {
      return String(Math.floor(Math.random() * 10000000) + 1);
    },

    getNodeElement (id) {
      if (this.$refs.node) {
        for(var i in this.$refs.node) {
          var el = this.$refs.node[i]
          if (el.getAttribute('data-id') == id)
            return el
        }
      }
    },

    getNodeCls (type) {
      for (var i in this.meta.nodes) {
        var _cls = this.meta.nodes[i]
        if (_cls.type === type) {
          return _cls
        }
      }
    },

    addNodeClick (type, extra) {
      if (typeof type === 'object')
        type = type.type

      // serach meta info
      var cls = this.getNodeCls(type)

      if (!cls) return

      this.edit.node = null
      this.edit.type = type
      this.edit.schema = cls.schema
      this.edit.model = undefined
      this.edit.error = false
      this.edit.key++
      this.edit.show = true
      this.edit.extra = extra
    },

    editNode (node) {
      var type = node.type
      var cls = this.getNodeCls(type)

      this.edit.node = node
      this.edit.type = type
      this.edit.schema = cls.schema
      this.edit.model = node.model
      this.edit.error = false
      this.edit.key++
      this.edit.show = true
      this.edit.extra = null
    },

    onEditDone () {
      this.edit.show = false
      if (this.edit.node) {
        this.edit.node.model = this.edit.model
      } else {
        this.addNodeToFlow(Object.assign({
          type: this.edit.type,
          model: this.edit.model
        }, this.edit.extra || {}))
      }
      this.dirty = true
    },

    nodeTitle (node) {
      return node.type
    },

    exportFlow () {
      if (!this.instance) return

      var nodes = this.nodes.map(node => {
        return {
          x: node.el.style.left,
          y: node.el.style.top,
          id: node.id,
          type: node.type,
          model: node.model
        }
      })

      var connections = this.instance.getConnections().map(c => {
        var endpoints = c.endpoints
        var srcId = endpoints[0].element.getAttribute('data-id')
        var destId = endpoints[1].element.getAttribute('data-id')
        var srcPort = endpoints[0].getUuid().split('.').pop()
        var destPort = endpoints[1].getUuid().split('.').pop()
        return {
          'src': [srcId, srcPort],
          'dest': [destId, destPort]
        }
      })

      return {
        nodes,
        connections
      }
    },

    importFlow (flowData, done) {
      if (!this.instance) return

      this.addNodesToFlow(flowData.nodes, () => {
        flowData.connections.forEach(connectionData => {
          var src = connectionData.src
          var dest = connectionData.dest

          this.instance.connect({uuids: [src[0] + '.outputs.' + src[1], dest[0] + '.inputs.' + dest[1]], editable: true});
        })

        if (done) done()
      })

    },

    load (done) {
      var flow = this.resource.attr('flow');

      this.importFlow(flow, () => {
        this.dirty = false
        if(done) done()
      })
    },

    loadFlowMeta (done, fail) {
      return this.$ething.request('/flows/meta').then(meta => {
        this.meta = meta
        if (done) done(meta)
      }).catch(err => {
        if (fail) fail(err)
      })
    }
  },

  mounted () {

    // setup some defaults for jsPlumb.
    var instance = this.instance = jsPlumb.getInstance({
      // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
                events:{
                    //click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    //tap:function() { alert("hey"); }
                }
            }]
        ],
        Container: this.$refs.flowchart
    });

    instance.registerConnectionType("basic", basicType);

    // suspend drawing and initialise.
    instance.batch(() => {

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", (connInfo, originalEvent) => {
            init(connInfo.connection);
            this.dirty = true
        });

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", (conn, originalEvent) => {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?")) {
                instance.deleteConnection(conn);
                this.dirty = true
            }
        });

        this.loadFlowMeta(() => {
          this.load()
        })

    });

    //jsPlumb.fire("jsPlumbDemoLoaded", instance);


  }
}
</script>

<style scoped>
  .leftMenu {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 250px;
    border-right: 1px #d9d9d9 solid;
  }

  .topMenu {
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 25px;
    z-index: 10;
  }

  .main {
    position: absolute;
    left: 250px;
    top: 0px;
    bottom: 0px;
    right: 0px;
  }

  .flowchart {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
  }
</style>

<style>

.flowchart {
    /*height: 550px;
    max-height: 700px;
    border: 1px solid #CCC;
    background-color: white;
    display: flex;*/
}

.flowchart .node {
    border: 1px solid #346789;
    box-shadow: 2px 2px 19px #aaa;
    -o-box-shadow: 2px 2px 19px #aaa;
    -webkit-box-shadow: 2px 2px 19px #aaa;
    -moz-box-shadow: 2px 2px 19px #aaa;
    -moz-border-radius: 0.5em;
    border-radius: 0.5em;
    opacity: 0.8;
    width: 160px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
    z-index: 20;
    position: absolute;
    background-color: #eeeeef;
    color: black;
    font-family: helvetica, sans-serif;
    padding: 0.5em;
    font-size: 0.9em;
    -webkit-transition: -webkit-box-shadow 0.15s ease-in;
    -moz-transition: -moz-box-shadow 0.15s ease-in;
    -o-transition: -o-box-shadow 0.15s ease-in;
    transition: box-shadow 0.15s ease-in;
}

.flowchart .node:hover {
    box-shadow: 2px 2px 19px #444;
    -o-box-shadow: 2px 2px 19px #444;
    -webkit-box-shadow: 2px 2px 19px #444;
    -moz-box-shadow: 2px 2px 19px #444;
    opacity: 0.6;
}

.flowchart .jtk-connector {
    z-index: 4;
}

.flowchart .jtk-endpoint, .endpointTargetLabel, .endpointSourceLabel {
    z-index: 21;
    cursor: pointer;
}

.flowchart .aLabel {
    /*background-color: white;
    padding: 0.4em;
    font: 12px sans-serif;
    color: #444;
    z-index: 21;
    border: 1px dotted gray;
    opacity: 0.8;
    cursor: pointer;*/
}

.flowchart .aLabel.jtk-hover {
    background-color: #5C96BC;
    color: white;
    border: 1px solid white;
}

.node.jtk-connected {
    border: 1px solid green;
}

.jtk-drag {
    outline: 4px solid pink !important;
}

path, .jtk-endpoint {
    cursor: pointer;
}

.jtk-overlay {
    background-color:transparent;
}

</style>
