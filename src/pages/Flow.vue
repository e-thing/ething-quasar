<template>
  <q-page>

    <div class="leftMenu">

      <div class="node-filter q-px-md q-py-sm">
        <resource-select
          :display-value="resourceFilterDisplayValue"
          v-model="resourceFilter"
          clearable
          hide-underline
          stack-label="Resource Filter"
        />
      </div>

      <q-list separator no-border>
        <flow-recursive-menu-node :root="$ethingUI.definitions.nodes" ns="nodes" :filter="nodeFilter" @click="addNodeClick"/>
      </q-list>
    </div>

    <div class="main" :style="dbg.enabled ? {} : {right: 0}">
      <div class="top-left-menu">
        <span class="text-faded">{{ resource.name() }}</span>
      </div>

      <div class="top-right-menu">
        <q-btn label="deploy" flat :color="dirty?'primary':'faded'" @click="deploy" />
        <q-btn label="debug" flat :color="dbg.enabled?'primary':'faded'" @click="toggle_debug" />
      </div>

      <drop @drop="handleDrop">
        <div ref="flowchart" class="flowchart jtk-surface jtk-surface-nopan">
            <div ref="node" class="node"
                  v-for="node in nodes" :key="node.id" :data-id="node.id"
                  @mouseover="nodeHoverHandler(node, true)" @mouseout="nodeHoverHandler(node, false)"
                  :style="computeNodeStyle(node)"
            >
              <q-icon v-if="node._cls.icon" :name="node._cls.icon" class="icon" />
              <div class="content">
                <flow-node :flow="resource" :node="node" class="full-width"/>
              </div>
              <div class="node-btns">
                <q-btn flat dense icon="edit" size="sm" color="faded"  @click="editNode(node)" class="node-btn"/>
                <q-btn flat dense icon="delete" size="sm" color="faded"  @click="removeNode(node)" class="node-btn"/>
              </div>
              <div class="node-dbg text-no-wrap q-caption" v-if="node._dbg.show">
                <div>
                  id: {{ node.id }}
                </div>
                <div v-for="(value, key) in node._dbg.data" :key="key">
                  {{ key }}: {{ value }}
                </div>
              </div>
            </div>
        </div>
      </drop>
    </div>

    <div class="rightMenu" v-if="dbg.enabled">

      <div class="text-right q-pa-sm">
        <q-btn v-if="dbg.items.length>0" icon="delete" flat color="faded" @click="dbg.items = []" />
      </div>

      <div v-if="dbg.items.length>0">
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
            <div v-if="item.exception" class="text-negative">
              {{ item.data.type }}: {{ item.data.message }}
              <pre class="dbg-item-data-exc-traceback">{{ item.data.traceback }}</pre>
            </div>
            <div v-else>
              {{ item.data }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-faded text-center q-caption">
        debug console
      </div>

    </div>

    <modal v-model="edit.show" :title="(edit.node?'Edit':'Add')+' '+edit.type" icon="add" :valid-btn-disable="edit.error" valid-btn-label="Add" @valid="onEditDone">
      <form-schema :key="edit.key" :schema="edit.schema" v-model="edit.model" @error="edit.error = $event"/>
    </modal>

  </q-page>
</template>

<script>

import { jsPlumb } from 'jsplumb'
import 'jsplumb/css/jsplumbtoolkit-defaults.css'

import { Drag, Drop } from 'vue-drag-drop'
import FlowRecursiveMenuNode from '../components/FlowRecursiveMenuNode'
import FlowNode from 'ething-quasar-core/src/components/FlowNode'
import FlowNodes from 'ething-quasar-core/src/components/FlowNodes'

import EThingUI from 'ething-quasar-core'
import EThing from 'ething-js'

import ResourceSelect from 'ething-quasar-core/src/components/ResourceSelect'
import FormSchemaEthingResource from 'ething-quasar-core/src/plugins/formSchema/FormSchemaEthingResource'


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
        connector: [ "Flowchart", {
          stub: [40, 60],
          gap: 55,
          cornerRadius: 5,
          alwaysRespectStubs: true
        } ],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {}
    },
// the definition of target endpoints (will appear when the user drags a connection)
    targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: "#7AB02C", radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true
    },
    init = function (c) {
        //connection.getOverlay("label").setLabel(connection.source.getAttribute('data-id') + "-" + connection.target.getAttribute('data-id'));
    };


export default {
  name: 'PageFlow',

  components: {
    Drag, Drop, FlowRecursiveMenuNode, FlowNode, ResourceSelect
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
      dbg: {
        enabled: false,
        items: [],
        opened: false
      },
      resourceFilter: null
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

    resourceFilterDisplayValue () {
      return this.resourceFilter===null ? 'none' : this.resourceFilter.basename()
    },

  },

  methods: {

    computeNodeStyle (node) {
      var style = {
        'border-color': node.color,
        'width': node._meta.width + 'px',
        'height': node._meta.height + 'px',
      }
      return style
    },

    nodeFilter (node) {
      if (this.resourceFilter) {
        if (this.$ethingUI.isSubclass(node, 'nodes/ResourceNode')) {
          return FormSchemaEthingResource.methods.filter.call(this, this.resourceFilter, node.properties.resource)
        }
        return false
      }
      return true
    },

    nodeHoverHandler (node, hover) {
      node._dbg = Object.assign(node._dbg, {
        show: hover && this.dbg.enabled
      })
    },

    handleDrop (data, event) {
      this.addNodeClick(data.type, {
        x: event.offsetX,
        y: event.offsetY
      })
    },

    deploy () {
      var flow = this.exportFlow()
      if (flow) {
        this.resource.set({
          flow
        }).then(() => {
          this.dirty = false
          this.resource.deploy()
        }).catch((err) => {
          console.error(err);
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
      flowSocket.on('dbg_info', this.debug_info_handler);

      flowSocket.emit('dbg_open', {
          flow_id: this.resource.id()
      })
    },

    stop_debug () {
      if (!this.dbg.opened) return

      this.dbg.opened = false

      if (this.resource) {
        flowSocket.emit('dbg_close', {
            flow_id: this.resource.id()
        })
      }

      flowSocket.off('dbg_data', this.debug_data_handler);
      flowSocket.off('dbg_info', this.debug_info_handler);

      release_socket(flowSocket)
    },

    debug_data_handler (data) {
      // {flow_id: "owBdc-U", data: "debug Tick", ts: 1546608540.8292224, node: "1460686"}
      data.data = JSON.parse(data.data)

      console.log('[socketio:Flow] data:', data)

      this.dbg.items.push(data)
    },

    debug_info_handler (data) {
      data.data = JSON.parse(data.data)

      console.log('[socketio:Flow] info:', data)

      var node = this.getNode(data.node)

      node._dbg = Object.assign(node._dbg, {
        data: data.data
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

      if (typeof node.name === 'undefined')
        node.name = cls.label

      if (typeof node.color === 'undefined')
        node.color = this.$ethingUI.utils.colorNameToHex(cls.color) // color may be color names, parse into hex format

      if (typeof node.x === 'undefined')
        node.x = 0

      if (typeof node.y === 'undefined')
        node.y = 0

      node._cls = cls

      // node component & metadata
      var nodeComponent = cls.node || 'Base'
      if (typeof nodeComponent === 'string') {
        nodeComponent = FlowNodes[nodeComponent]
      }
      nodeComponent = Vue.extend(nodeComponent)
      var metadata = nodeComponent.options.metadata
      node._meta = typeof metadata === 'function' ? metadata.call(this) : metadata

      this.$set(node, '_dbg', {
        show: false,
        data: {}
      })

      this.nodes.push(node)

      this.$nextTick(() => {
        var el = this.getNodeElement(node.id)

        node._el = el

        el.style.left = node.x+'px'
        el.style.top = node.y+'px'

        this.instance.batch(() => {

          // inputs
          if (cls.inputs) {
            cls.inputs.forEach((input, index) => {
              this.instance.addEndpoint(el, targetEndpoint, {
                  anchor: "ContinuousLeft",
                  uuid: node.id + ".inputs." + input,
                  overlays: [
                      [ "Label", {
                        location: [-2.2, 0.5],
                        label: input,
                        cssClass: "endpointInputLabel",
                        visible: true
                      } ]
                  ]
              });
            })
          }

          // outputs
          if (cls.outputs) {
            cls.outputs.forEach((output, index) => {
              this.instance.addEndpoint(el, sourceEndpoint, {
                  anchor: "ContinuousRight",
                  uuid: node.id + ".outputs." + output,
                  overlays: [
                      [ "Label", {
                        location: [3.0, 0.5],
                        label: output,
                        cssClass: "endpointOutputLabel",
                        visible: true
                      } ]
                  ]
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
      return this.$ethingUI.get(type)
    },

    getNode (nodeId) {
      for(var i in this.nodes) {
        if (this.nodes[i].id === nodeId) {
          return this.nodes[i]
        }
      }
    },

    addNodeClick (type, extra) {
      var cls = this.getNodeCls(type)
      this._initEditObj(type)
      this.edit.extra = extra
      if (this.resourceFilter && this.$ethingUI.isSubclass(cls, 'nodes/ResourceNode')) {
        Object.assign(this.edit.model, {
          resource: this.resourceFilter.id()
        })
      }
    },

    editNode (node) {
      var type = node.type

      this._initEditObj(type)

      this.edit.node = node
      this.edit.model = Object.assign(this.edit.model, this.cleanNode(node))
    },

    _initEditObj (type) {
      var cls = this.getNodeCls(type)

      this.edit.node = null
      this.edit.type = type

      // remove x and y properties from the schema

      var schemaProps = Object.assign({}, cls.properties)
      delete schemaProps.x
      delete schemaProps.y
      var schemaRequired = (cls.required || []).filter(n => ['x', 'y'].indexOf(n)===-1)

      this.edit.schema = {
        type: 'object',
        properties: schemaProps,
        required: schemaRequired,
        description: cls.description
      }

      this.edit.model = {
        name: cls.label,
        color: this.$ethingUI.utils.colorNameToHex(cls.color) // color may be color names, parse into hex format
      }
      this.edit.error = false
      this.edit.key++
      this.edit.show = true
      this.edit.extra = null
    },

    onEditDone () {
      this.edit.show = false
      var model = Object.assign({}, this.edit.model, this.edit.extra || {})
      if (this.edit.node) {
        Object.assign(this.edit.node, model)
      } else {
        this.addNodeToFlow(Object.assign({
          type: this.edit.type
        }, model))
      }
      this.dirty = true
    },

    cleanNode (node) {
      // copy
      var copy = Object.assign({}, node)

      // remove privates
      delete copy._dbg
      delete copy._cls
      delete copy._el
      delete copy._meta

      // update x && y
      copy.x = parseInt(node._el.style.left)
      copy.y = parseInt(node._el.style.top)

      return copy
    },

    exportFlow () {
      if (!this.instance) return

      var nodes = this.nodes.map(this.cleanNode)

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

        this.load()

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
    border-right: 4px #d9d9d9 solid;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .rightMenu {
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    width: 300px;
    border-left: 4px #d9d9d9 solid;
    overflow-y: auto;
    overflow-x: auto;
  }

  .top-left-menu {
    display: inline-block;
    position: absolute;
    top: 18px;
    left: 25px;
    z-index: 10;
  }

  .top-right-menu {
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

  .node-filter {
    border-bottom: 4px #d9d9d9 solid;
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

.flowchart .node > .node-btns {
  display: none;
  position: absolute;
  right: 0px;
  top: 0px;
}

.flowchart .node:hover > .node-btns {
  display: block;
}

.flowchart .node.active {
    box-shadow: 2px 2px 19px #ffb427;
    -o-box-shadow: 2px 2px 19px #ffb427;
    -webkit-box-shadow: 2px 2px 19px #ffb427;
    -moz-box-shadow: 2px 2px 19px #ffb427;
}

.flowchart .node > .node-dbg {
  position: absolute;
  left: 0px;
  top: 56px;
}

.flowchart .jtk-connector {
    z-index: 4;
}

.flowchart .jtk-endpoint, .endpointInputLabel, .endpointOutputLabel {
    z-index: 21;
    cursor: pointer;
}

.endpointInputLabel, .endpointOutputLabel {
    font-size: 12px;
    width: 50px;
    background-color: white;
    opacity: 0.5;
}

.endpointInputLabel {
    text-align: right;
}

.endpointOutputLabel {
    text-align: left;
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
    /*background-color:transparent;*/
}

</style>
