<template>
  <q-page>

    <div class="leftMenu">
      <q-list separator no-border>
        <flow-recursive-menu-node :node="menuRoot" @click="addNodeClick"/>
      </q-list>
    </div>

    <div class="main" :style="dbg.enabled ? {} : {right: 0}">
      <div class="topMenu">
        <q-btn label="deploy" flat :color="dirty?'primary':'faded'" @click="deploy" />
        <q-btn label="debug" flat :color="dbg.enabled?'primary':'faded'" @click="toggle_debug" />
      </div>

      <drop @drop="handleDrop">
        <div ref="flowchart" class="flowchart jtk-surface jtk-surface-nopan">
            <div ref="node" class="node" :style="{'border-color': node.color}" v-for="node in nodes" :key="node.id" :data-id="node.id">
              <q-icon v-if="node.cls.icon" :name="node.cls.icon" class="icon" />
              <div class="content">
                <strong class="ellipsis">{{ nodeTitle(node) }}</strong>
                <q-btn flat dense icon="edit" size="sm" color="faded"  @click="editNode(node)" />
                <q-btn flat dense icon="delete" size="sm" color="faded"  @click="removeNode(node)" />
              </div>
            </div>
        </div>
      </drop>
    </div>

    <div class="rightMenu" v-if="dbg.enabled">

      <div class="text-right q-pa-sm">
        <q-btn icon="delete" flat color="faded" @click="dbg.items = []" />
      </div>

      <div>
        <div class="dbg-item q-pa-sm" v-for="(item, index) in dbg.items" :key="index" @mouseover="setDbgActiveNode(item.node, true)" @mouseout="setDbgActiveNode(item.node, false)">
          <div class="dbg-item-header q-caption">
            <span class="dbg-item-header-date text-faded">
              {{ $ethingUI.utils.dateToString(item.ts * 1000) }}
            </span>
            <span v-if="item.node" class="dbg-item-header-node text-purple">
              [{{ nodeIdToName(item.node) }}]
            </span>
          </div>
          <div class="dbg-item-data">
            {{ item.data }}
          </div>
        </div>
      </div>

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
import FlowRecursiveMenuNode from '../components/FlowRecursiveMenuNode'

import EThingUI from 'ething-quasar-core'
import EThing from 'ething-js'


var flowSocket = EThingUI.io(EThing.config.serverUrl + '/flow', {
  autoConnect: false
});

flowSocket.on('connect', () => {
  console.log('[socketio:Flow] connected')
});

flowSocket.on('disconnect', () => {
  console.log('[socketio:Flow] disconnected')
});

const SOCKET_RELEASE_DELAY = 10000;

function lock_socket (sock) {
  sock._socket_ref_counter = sock._socket_ref_counter || 0

  sock._socket_ref_counter += 1

  if (sock._socket_ref_counter===1) {
    if (typeof sock._socket_close_timer !== 'undefined' && sock._socket_close_timer!==null) {
      clearTimeout(sock._socket_close_timer)
      sock._socket_close_timer = null;
    } else {
      sock.open()
    }
  }

}

function release_socket (sock) {
  sock._socket_ref_counter = sock._socket_ref_counter || 0

  if (sock._socket_ref_counter>0) {
    sock._socket_ref_counter -= 1

    if (sock._socket_ref_counter===0) {
      sock._socket_close_timer = setTimeout(() => {
        sock._socket_close_timer = null
        sock.close()
      }, SOCKET_RELEASE_DELAY)
    }
  }
}


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
    Drag, Drop, FlowRecursiveMenuNode
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
      dirty: false,
      menuRoot: [],
      dbg: {
        enabled: false,
        items: [],
        opened: false
      }
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

    toggle_debug () {
      this.dbg.enabled = !this.dbg.enabled;
      this.dbg.enabled ? this.start_debug() : this.stop_debug();
    },

    start_debug () {
      if (this.dbg.opened) return

      this.dbg.opened = true

      lock_socket(flowSocket)

      flowSocket.on('dbg_data', this.debug_data_handler);

      flowSocket.emit('dbg_open', {
          flow_id: this.resource.id()
      })
    },

    stop_debug () {
      if (!this.dbg.opened) return

      this.dbg.opened = false

      flowSocket.emit('dbg_close', {
          flow_id: this.resource.id()
      })

      flowSocket.off('dbg_data', this.debug_data_handler);

      release_socket(flowSocket)
    },

    debug_data_handler (data) {
      // {flow_id: "owBdc-U", data: "debug Tick", ts: 1546608540.8292224, node: "1460686"}
      data.data = JSON.parse(data.data)

      console.log('[socketio:Flow] data:', data)

      this.dbg.items.push(data)
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

      if (typeof node.name === 'undefined')
        node.name = type

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

      node.cls = cls

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

    nodeIdToName (nodeId) {
      var node = this.getNode(nodeId)
      return node && node.name ? node.name : nodeId
    },

    removeNode (node) {
      this.removeNodeToFlow(node)
      this.dirty = true
    },

    setDbgActiveNode (node, active) {
      if (typeof node === 'object')
        node = node.id

      var el = this.getNodeElement(node)
      if (el) {
        el.classList.toggle("active", active );
      }

      return
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

    getNode (nodeId) {
      for(var i in this.nodes) {
        if (this.nodes[i].id === nodeId) {
          return this.nodes[i]
        }
      }
    },

    addNodeClick (type, extra) {
      if (typeof type === 'object')
        type = type.type

      // serach meta info
      var cls = this.getNodeCls(type)

      if (!cls) return

      this._initEditObj(cls)
      this.edit.extra = extra

    },

    editNode (node) {
      var type = node.type
      var cls = this.getNodeCls(type)

      this._initEditObj(cls)

      this.edit.node = node
      if (node.name) this.edit.model.appearance.name = node.name
      if (node.color) this.edit.model.appearance.color = node.color
      this.edit.model.properties = node.model
    },

    _initEditObj (cls) {
      this.edit.node = null
      this.edit.type = cls.type
      this.edit.schema = {
        type: 'object',
        properties: {
          appearance: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 1
              },
              color: {
                type: 'string',
                format: 'color'
              }
            },
            required: ['name', 'color']
          },
          properties: cls.schema
        }
      }
      this.edit.model = {
        appearance: {
          name: cls.type,
          color: cls.color
        }
      }
      this.edit.error = false
      this.edit.key++
      this.edit.show = true
      this.edit.extra = null
    },

    onEditDone () {
      this.edit.show = false
      var appearance = this.edit.model.appearance
      var model = this.edit.model.properties || {}
      if (this.edit.node) {
        this.edit.node.model = model
        this.edit.node.name = appearance.name
        this.edit.node.color = appearance.color
      } else {
        this.addNodeToFlow(Object.assign({
          type: this.edit.type,
          model,
          name: appearance.name,
          color: appearance.color
        }, this.edit.extra || {}))
      }
      this.dirty = true
    },

    nodeTitle (node) {
      return node.name || node.type
    },

    exportFlow () {
      if (!this.instance) return

      var nodes = this.nodes.map(node => {
        return {
          x: node.el.style.left,
          y: node.el.style.top,
          id: node.id,
          type: node.type,
          model: node.model,
          name: node.name,
          color: node.color
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

      console.log(flowData)

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

        // recursive order by categories
        var root = {
          categories: [],
          nodes: []
        }

        function findCat (path, create) {
          var ptr = root
          for (var i in path) {
            var pathItem = path[i]
            if (!pathItem) break
            var found = false
            for (var j in ptr.categories) {
              var cat = ptr.categories[j]
              if (cat.name === pathItem) {
                ptr = cat
                found = true
                break
              }
            }
            if (!found) {
              if (create) {
                var item = {
                  name: pathItem,
                  categories: [],
                  nodes: []
                }
                ptr.categories.push(item)
                ptr = item
              } else {
                return false
              }
            }
          }
          return ptr
        }

        meta.nodes.forEach( node => {
          var category = node.category || ''
          var categoriesPath = category.split(/[\.,;\/]/)

          var cat = findCat(categoriesPath, true)
          cat.nodes.push(node)

        })

        this.menuRoot = root

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


  },

  beforeDestroy () {
    this.stop_debug()
  }
}
</script>

<style scoped>
  .leftMenu {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 300px;
    border-right: 1px #d9d9d9 solid;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .rightMenu {
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 300px;
    border-left: 1px #d9d9d9 solid;
    overflow-y: auto;
    overflow-x: auto;
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
    left: 300px;
    top: 0px;
    bottom: 0px;
    right: 300px;
  }

  .flowchart {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
  }

  .dbg-item:first-child {
    border-top: 1px #d9d9d9 solid;
  }

  .dbg-item {
    border-bottom: 1px #d9d9d9 solid;
  }

</style>

<style>

.leftMenu button .q-btn-inner > div {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

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
    -moz-border-radius: 5px;
    border-radius: 5px;
    opacity: 0.8;
    width: 200px;
    height: 48px;
    display: flex;
    /*justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;*/
    z-index: 20;
    position: absolute;
    background-color: #eeeeef;
    color: black;
    font-family: helvetica, sans-serif;
    /*padding: 0.5em;*/
    /*font-size: 0.9em;*/
    -webkit-transition: -webkit-box-shadow 0.15s ease-in;
    -moz-transition: -moz-box-shadow 0.15s ease-in;
    -o-transition: -o-box-shadow 0.15s ease-in;
    transition: box-shadow 0.15s ease-in;
}

.flowchart .node > .icon {
  font-size: 24px;
  width: 50px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #c1c1c1;
}

.flowchart .node > .content {
  width: auto;
  min-width: 0;
  max-width: 100%;
  -webkit-box-flex: 10000;
  -ms-flex: 10000 1 0%;
  flex: 10000 1 0%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  display: flex;
  font-size: 0.9em;
}

.flowchart .node:hover {
    box-shadow: 2px 2px 19px #444;
    -o-box-shadow: 2px 2px 19px #444;
    -webkit-box-shadow: 2px 2px 19px #444;
    -moz-box-shadow: 2px 2px 19px #444;
    opacity: 0.6;
}

.flowchart .node.active {
    box-shadow: 2px 2px 19px #444;
    -o-box-shadow: 2px 2px 19px #444;
    -webkit-box-shadow: 2px 2px 19px #444;
    -moz-box-shadow: 2px 2px 19px #444;
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
