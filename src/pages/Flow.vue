<template>
  <q-page class="bg-white">

    <div class="leftMenu" :class="{enabled: showMenu}" v-touch-swipe.left="closeMenu">

      <div class="header text-right q-pa-sm" v-if="$q.screen.xs">
        <q-btn v-if="$q.screen.xs" icon="close" label="close" flat color="faded" @click="showMenu = false" />
      </div>

      <div class="node-filter q-px-md q-py-sm">
        <resource-select
          v-model="resourceFilter"
          default-sort="type"
          label="Resource Filter"
          disable-create
          popup-content-style="width: 300px"
          borderless
        />
      </div>

      <q-list separator>
        <flow-recursive-menu-node :root="menu" @click="addNodeClick" :opened="resourceFilter!==null" :key="resourceFilter && resourceFilter.id()">
          <div slot-scope="{node}" class="node node-menu no-shadow" :style="{'background-color': node.color}">
            <div class="endpoint" v-if="node.inputs"></div>
            <q-icon v-if="node.icon" :name="node.icon" class="icon" />
            <div class="content">
              <strong class="ellipsis full-width" >{{ node.title }}</strong>
            </div>
            <q-tooltip v-if="node.description" anchor="center right" self="center left" :offset='[40, 0]' :delay="1000">
              {{ node.description }}
            </q-tooltip>
            <div class="endpoint" v-if="node.outputs"></div>
          </div>
        </flow-recursive-menu-node>
      </q-list>
    </div>

    <q-splitter
      v-model="splitterModel"
      :limits="splitterLimits"
      :disable="splitterDisable"
      class="main"
      separator-style="width: 4px; background-color: #d9d9d9;"
    >
      <template v-slot:before>
        <div class="board">
          <div class="top-left-menu">
            <q-btn icon="menu" flat color="faded" @click="showMenu = true" round class="q-mr-sm" v-if="$q.screen.xs"/>
            <span class="text-faded filename">{{ resource.name() }}</span>
          </div>

          <div class="top-right-menu">
            <q-btn :label="resource.attr('enabled') ? 'stop' : 'run'" :icon="resource.attr('enabled') ? 'stop' : 'mdi-play'" flat :color="resource.attr('enabled')?'negative':'secondary'" @click="toggleFlowEnable(!resource.attr('enabled'))" />
            <q-btn label="deploy" flat :color="dirty?'primary':'faded'" @click="deploy" v-show="resource.attr('enabled')" />
            <q-btn label="debug" flat :color="dbg.enabled?'primary':'faded'" @click="toggle_debug" />
          </div>

          <div class="bottom-right-menu bg-secondary q-pl-md" v-if="selectedNodes.length>0">
            <span class="text-white vertical-middle">{{ selectedNodes.length }} node{{ selectedNodes.length>1 ? 's' : ''}} selected</span>
            <q-btn label="cancel" :round="$q.screen.xs" icon="mdi-cancel" flat color="white" @click="clearSelection()" />
            <q-btn label="duplicate" :round="$q.screen.xs" icon="mdi-content-duplicate" flat color="white" @click="duplicate(selectedNodes);clearSelection();" />
            <q-btn label="remove" :round="$q.screen.xs" icon="delete" flat color="white" @click="deleteSelection()" />
          </div>


          <drop @drop="handleDrop">
            <div ref="flowchart" class="flowchart jtk-surface jtk-surface-nopan" @click.self="flowchartClick">
                <div ref="node" class="node non-selectable"
                      v-for="node in nodes" :key="node.id" :data-id="node.id"
                      @mouseover="nodeHoverHandler(node, true)" @mouseout="nodeHoverHandler(node, false)"
                      v-touch-hold.noMouse="node._hold"
                      @mousedown="node._mousedown"
                      @mouseup="node._mouseup"
                      :class="{active: node._isActive, selected: node._selected, error: !!node._dbg.data.error}"
                >
                  <q-icon v-if="node._cls.icon" :name="node._cls.icon" class="icon" />
                  <div class="content">
                    <flow-node :flow="resource" :node="node" class="full-width ellipsis"/>
                  </div>
                  <div class="node-btns">
                    <q-btn flat dense icon="edit" size="sm" color="faded"  @click.stop.prevent="editNode(node)" class="node-btn"/>
                    <q-btn flat dense icon="delete" size="sm" color="faded"  @click.stop.prevent="removeNode(node)" class="node-btn"/>
                  </div>
                  <div class="node-error text-no-wrap text-caption" v-if="node._dbg.data.error">
                    {{ node._dbg.data.error }}
                  </div>
                  <div class="node-dbg text-no-wrap text-caption" v-if="dbg.enabled">
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
      </template>

      <template v-slot:after>

        <div>

          <div class="text-right q-pa-sm">
            <q-btn v-if="dbg.items.length>0" icon="delete" flat color="faded" @click="dbg.items = []" />
            <q-btn v-if="$q.screen.xs" icon="close" label="close" flat color="faded" @click="dbg.enabled = false" />
          </div>

          <div v-if="dbg.items.length>0">
            <div class="dbg-item q-pa-sm" v-for="(item, index) in dbg.items" :key="index" @mouseover="setDbgActiveNode(item.node, true)" @mouseout="setDbgActiveNode(item.node, false)">
              <div class="dbg-item-header text-caption">
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
                  <json-formatter :value="item.data" :options="{}" />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-faded text-center text-caption">
            debug console
          </div>

        </div>
      </template>
    </q-splitter>

    <modal v-model="edit.show" :title="editTitle()" :icon="edit.node ? 'edit' : 'add'" :valid-btn-disable="edit.error" :valid-btn-label="edit.node ? 'Save' : 'Add'" @valid="onEditDone">
      <form-schema :key="edit.key" :schema="edit.schema" v-model="edit.model" :context="edit.context" @error="edit.error = $event"/>
    </modal>

  </q-page>
</template>

<script>

import { jsPlumb } from 'jsplumb'
import 'jsplumb/css/jsplumbtoolkit-defaults.css'

import { debounce, extend } from 'quasar'

import { Drag, Drop } from 'vue-drag-drop'
import FlowRecursiveMenuNode from '../components/FlowRecursiveMenuNode'
import FlowNode from '../components/FlowNode'
import FlowNodes from '../components/FlowNodes'

import EThingUI from '../core'
import EThing from 'ething-js'

import ResourceSelect from '../components/ResourceSelect'
import FormSchemaEthingResource from '../boot/formSchema/extra/EthingResource'

import JsonFormatter from '../components/JsonFormatter'

const DBLE_CLICK_DELAY = 400;//ms

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


function getEventPos (e) {
  var out = {x:0, y:0};
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var touch = e.touches[0] || e.changedTouches[0];
    out.x = touch.pageX;
    out.y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    out.x = e.pageX;
    out.y = e.pageY;
  }
  return out;
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


function checkMouseEvent (evt) {
  var path = evt.path
  for(var i in path) {
    var el = path[i]
    if (el.classList.contains("node")) break
    var type = el.type
    if (type==='button' || type ==='input') {
      return false
    }
  }
  return true
}


export default {
  name: 'PageFlow',

  components: {
    Drag, Drop, FlowRecursiveMenuNode, FlowNode, ResourceSelect, JsonFormatter
  },

  data () {

    return {
      instance: null,
      nodes: [],
      edit: {
        cls: {},
        title: '',
        type: null,
        show: false,
        model: undefined,
        error: false,
        node: null,
        schema: {},
        key: 0,
        extra: null,
        context: {}
      },
      meta: {},
      dirty: false,
      dbg: {
        enabled: false,
        items: [],
        opened: false
      },
      resourceFilter: null,
      activeNode: null,
      showMenu: false,
      selectedNodes: [],
      _lastClickTs: 0,
      _clickTimer: null,
      splitterModel: 100,
      splitterLimits: [0, 100],
      splitterDisable: true
    }

  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$ething.arbo.get(id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }

      return r
    },

    menu () {

      var new_item = () => {
        return {
          nodes: [],
          children: {}
        }
      }

      var root = new_item()

      var find = (path) => {
        path = path ? path.split('.') : []
        var p = root
        path.forEach(i => {
          if (typeof p.children[i] === 'undefined') {
            p.children[i] = new_item()
          }
          p = p.children[i]
        })
        return p
      }

      this.$ethingUI.iterate('nodes', type => {
        var d = this.$ethingUI.get(type)
        if (d.virtual) return
        if (!this.nodeFilter(d)) return
        var n = find(d.category)
        n.nodes.push(d)
      })

      return root

    }

  },

  methods: {

    toggleFlowEnable (val) {
      this.resource.set({enabled: !!val}).catch((err) => {
        console.error(err);
      })
    },

    closeMenu () {
      this.showMenu = false
    },

    flowchartClick (evt) {
      this.setActiveNode(null)
      this.clearSelection()
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
      this.addNodeClick(data.node, {
        x: Math.round((event.offsetX - 100) / 20) * 20, // round to the closest 20 pixels
        y: Math.round((event.offsetY - 24) / 20) * 20,
      })
    },

    save: debounce( function(){
      var flow = this.exportFlow()
      if (flow) {
        this.resource.set(flow).catch((err) => {
          console.error(err);
          this.$q.notify({
            icon: 'mdi-alert-circle',
            color: 'negative',
            message: 'Flow error: ' + String(err),
            timeout: 10000
          })
        })
      }
    }, 500),

    deploy () {
      var flow = this.exportFlow()
      if (flow) {
        this.resource.set(flow).then(() => {
          this.dirty = false
          this.resource.deploy()
        }).catch((err) => {
          console.error(err);
        })
      }
    },

    toggle_debug () {
      this.dbg.enabled = !this.dbg.enabled;
      if (this.dbg.enabled) {
        this.splitterModel = 70
        this.splitterLimits = [20, 80]
        this.splitterDisable = false
      } else {
        this.splitterModel = 100
        this.splitterLimits = [30, 100]
        this.splitterDisable = true
      }
      //this.dbg.enabled ? this.start_debug() : this.stop_debug();
    },

    start_debug () {
      if (this.dbg.opened) return

      this.dbg.opened = true

      lock_socket(flowSocket)

      flowSocket.on('dbg_evt', this.debug_evt_handler);

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

      flowSocket.off('dbg_evt', this.debug_evt_handler);

      release_socket(flowSocket)
    },

    debug_evt_handler (pkt) {
      var event = pkt.event
      var payload = JSON.parse(pkt.payload)

      //console.log('[socketio:Flow] evt:', event)

      switch (event) {
        case 'flow_started':
          this.$q.notify({
            icon: 'mdi-play',
            color: 'positive',
            message: 'Flow started',
            timeout: 1500
          })
          break;
        case 'flow_warn':
          this.$q.notify({
            icon: 'mdi-information',
            color: 'info',
            message: payload.msg,
            timeout: 3000
          })
          break;
        case 'flow_dbg':

          this.dbg.items.push(payload)

          if (this.dbg.items.length > 100) {
            this.dbg.items = this.dbg.items.slice(-100)
          }

          break;
        case 'flow_info':

          // console.log('[socketio:Flow] info:', payload)

          var node = this.getNode(payload.node)

          if (node) {
            node._dbg = Object.assign(node._dbg, {
              data: payload.data
            })
          }

          break;

      }
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
        node.name = cls.title

      if (typeof node.color === 'undefined')
        node.color = this.$ethingUI.utils.colorNameToHex(cls.color) // color may be color names, parse into hex format

      if (typeof node.x === 'undefined')
        node.x = 0

      if (typeof node.y === 'undefined')
        node.y = 0

      node._cls = cls

      node._selected = false

      node._hold = (evt) => {
        this.editNode(node)
      }

      node._click = (evt) => {
        //if (!checkMouseEvent(evt)) return
        this.selectNode(node, !node._selected, evt.ctrlKey)
        /*if (this.$q.screen.xs) {
          if (!node._isActive) {
            this.setActiveNode(node)
          }
        } else {
          //this.selectNode(node, !node._selected, evt.ctrlKey)
        }*/
      }

      node._dbclick = (evt) => {
        //if (!checkMouseEvent(evt)) return
        this.editNode(node)
      }

      node._mousedown = (evt) => {
        if (!checkMouseEvent(evt)) return
        if (evt.which === 1) {
          this.mouseInfo = {
            ts: evt.timeStamp,
            x: evt.x,
            y: evt.y
          }
        }
      }

      node._mouseup = (evt) => {
        if (!checkMouseEvent(evt)) return
        if (evt.which === 1 && this.mouseInfo) {
          //if (evt.timeStamp - this.mouseInfo.ts < 500) {
            var d = Math.sqrt( Math.pow(evt.x - this.mouseInfo.x, 2) + Math.pow(evt.y - this.mouseInfo.y, 2) )
            if (d < 10) {
              var ts = Date.now()
              if (this._lastClickTs && ts - this._lastClickTs < DBLE_CLICK_DELAY) {
                // dbclick
                this._lastClickTs = 0
                if (this._clickTimer!== null) {
                  clearTimeout(this._clickTimer)
                  this._clickTimer = null
                }

                node._dbclick(evt)
              } else {
                this._lastClickTs = ts
                this._clickTimer = setTimeout(() => {
                  // click
                  node._click(evt)
                }, DBLE_CLICK_DELAY)
              }
            } else {
              // drag
            }
          //}

          this.mouseInfo = null
        }
      }

      // active state

      node._isActive = false

      node._activate = () => {
        node._isActive = true
      }

      node._deactivate = () => {
        node._isActive = false
      }



      this.$set(node, '_dbg', {
        show: false,
        data: {}
      })

      this.nodes.push(node)

      node._draw = () => {
        if (node._el) {
          node._el.style['border-color'] = node.color
        }
      }

      this.$nextTick(() => {
        var el = this.getNodeElement(node.id)

        node._el = el

        el.style.left = node.x+'px'
        el.style.top = node.y+'px'

        node._draw()

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
              //this.dirty = true // no need to redeploy
              this.save()
            },
            consumeStartEvent: false
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

    duplicate (nodes) {
      if (!nodes || !nodes.length) return

      nodes.forEach(node => {
        var nodeCopy = this.cleanNode(node)
        delete nodeCopy.id
        nodeCopy.x += 50
        nodeCopy.y += 50
        this.addNodeToFlow(nodeCopy, this.save)
        this.dirty = true
      })
    },

    setActiveNode (node) {
      if (node === this.activeNode) return
      if (this.activeNode) {
        this.activeNode._deactivate()
        this.activeNode = null
      }
      if (node) {
        this.activeNode = node
        node._activate()
      }
    },

    selectNode (node, selected, add) {
      if (add) {
        var i = this.selectedNodes.indexOf(node)
        if (selected) {
          if (i === -1) {
            this.selectedNodes.push(node)
          }
        } else {
          if (i !== -1) {
            this.selectedNodes.splice(i, 1)
          }
        }
        node._selected = selected
      } else {
        this.clearSelection()
        if (selected) {
          this.selectedNodes = [node]
          node._selected = selected
        }
      }
    },

    clearSelection () {
      this.selectedNodes.forEach(n => {
        n._selected = false
      })
      this.selectedNodes = []
    },

    deleteSelection () {
      if (this.selectedNodes.length && confirm('Delete selected nodes ?')) {
        this.selectedNodes.forEach(node => {
          this.removeNodeToFlow(node)
        })
        this.selectedNodes = []
        this.dirty = true
        this.save()
      }
    },

    nodeIdToName (nodeId) {
      var node = this.getNode(nodeId)
      return node && node.name ? node.name : nodeId
    },

    removeNode (node) {
      if (confirm("Delete node " + node.name + "?")) {
        this.removeNodeToFlow(node)
        this.dirty = true
        this.save()
      }
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
      var cls;
      if (typeof type === 'string') {
        cls = this.getNodeCls(type)
      } else {
        cls = type
        type = cls._type
      }
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

    editTitle () {
      return (this.edit.node?'Edit':'Add')+' "'+this.edit.cls.title+'" node'
    },

    _initEditObj (type) {
      var cls = this.getNodeCls(type)

      this.edit.cls = cls
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
        name: cls.title,
        color: this.$ethingUI.utils.colorNameToHex(cls.color) // color may be color names, parse into hex format
      }
      this.edit.error = false
      this.edit.key++
      this.edit.show = true
      this.edit.extra = null
      Object.assign(this.edit.context, {
        'flow': this.resource
      })
    },

    onEditDone () {
      this.edit.show = false
      var model = Object.assign({}, this.edit.model, this.edit.extra || {})
      if (this.edit.node) {
        Object.assign(this.edit.node, model)
        this.edit.node._draw()
        this.save()
      } else {
        this.addNodeToFlow(Object.assign({
          type: this.edit.type
        }, model), this.save)
      }
      this.dirty = true
    },

    cleanNode (node) {
      // copy
      var copy = {}
      for (var i in node) {
        // remove privates
        if (i[0] == '_') continue
        copy[i] = node[i]
      }

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

      // make a deep copy to avoid to pollute the incoming data
      flowData = extend(true, {}, flowData)

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
      var flow = {
        nodes: this.resource.attr('nodes'),
        connections: this.resource.attr('connections'),
      }

      this.importFlow(flow, () => {
        this.dirty = false
        if(done) done()
      })
    },

    onKeyUp (evt) {
      if (evt.keyCode == 8 || evt.keyCode == 46) {
        this.deleteSelection()
      }
    }

  },

  mounted () {

    var loaded = false;

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
            if (loaded) {
              this.dirty = true
              this.save()
            }
        });

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", (conn, originalEvent) => {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?")) {
                instance.deleteConnection(conn);
                this.dirty = true
                this.save()
            }
        });

        this.load(() => {
          loaded = true
          this.start_debug()
        })

    });

    // add global keyboard listener
    window.addEventListener('keyup', this.onKeyUp);

  },

  beforeDestroy () {
    this.stop_debug()

    window.removeEventListener('keyup', this.onKeyUp)
  }
}
</script>

<style lang="stylus" scoped>


  .leftMenu {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 300px;
    border-right: 4px #d9d9d9 solid;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: white;
    z-index: 1005;
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
    background-color: white;
    z-index: 1000;
  }

  .top-left-menu {
    display: inline-block;
    position: absolute;
    top: 10px;
    left: 25px;
    z-index: 10;
  }

  .top-left-menu .filename {
    line-height: 42px;
  }

  .top-right-menu {
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 25px;
    z-index: 10;
  }

  .bottom-right-menu {
    display: inline-block;
    position: absolute;
    bottom: 26px;
    right: 25px;
    z-index: 10;
  }

  .main {
    position: absolute;
    left: 300px;
    top: 0px;
    bottom: 0px;
    right: 0px;
    overflow: hidden;
  }

  .board {
    width: 100%;
    height: 100%;
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

  .leftMenu > .node-filter, .leftMenu > .header {
    border-bottom: 4px #d9d9d9 solid;
  }

  .endpoint {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: rgb(122, 176, 44);
    display: block;
    position: absolute;
    top: 50%;

  }

  .endpoint:first-child {
    left: 0px;
    transform: translate(-50%, -50%);
  }

  .endpoint:last-child {
    right: 0px;
    transform: translate(50%, -50%);
  }

  .node {
      width: 200px;
      height: 48px;
      border: 1px solid #346789;
      box-shadow: 2px 2px 19px #aaa;
      -o-box-shadow: 2px 2px 19px #aaa;
      -webkit-box-shadow: 2px 2px 19px #aaa;
      -moz-box-shadow: 2px 2px 19px #aaa;
      -moz-border-radius: $generic-border-radius;
      border-radius: $generic-border-radius;
      opacity: 0.8;
      display: flex;
      position: relative;
      background-color: #eeeeef;
      color: black;
      font-family: helvetica, sans-serif;
      cursor: pointer;
  }

  /* margins */
  .node:before {
      content: "";
      display: block;
      position: absolute;
      left: -50px;
      width: 50px;
      height: 50px;
      top: -50px;
  }

  .node:after {
      content: "";
      display: block;
      position: absolute;
      right: -50px;
      width: 50px;
      height: 50px;
      bottom: -50px;
  }

  .node.node-menu {
    width: 100%;
    height: 42px;
  }

  .node > .icon {
    font-size: 24px;
    width: 50px;
    height: 100%;
    border-top-left-radius: $generic-border-radius;
    border-bottom-left-radius: $generic-border-radius;
    background-color: rgba(0, 0, 0, 0.15);
  }

  .node > .content {
    width: auto;
    min-width: 0;
    max-width: 100%;
    -webkit-box-flex: 10000;
    -ms-flex: 10000 1 0%;
    flex: 10000 1 0%;
    justify-content: center;
    align-items: center;
    text-align: center;
    display: flex;
    font-size: 0.9em;
  }

  .flowchart {
      /*height: 550px;
      max-height: 700px;
      border: 1px solid #CCC;
      background-color: white;
      display: flex;*/
  }

  .flowchart .node {
      z-index: 20;
      position: absolute;
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

  .flowchart .node.error {
    border-color: $negative !important;
    border-width: 2px !important;
  }

  .flowchart .node.selected {
    border-color: #26a69a !important;
    border-width: 2px !important;
  }

  .flowchart .node.selected > .icon, .flowchart .node.error > .icon {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  .flowchart .node.selected > .icon {
    background-color: $secondary;
  }

  .flowchart .node > .node-dbg {
    position: absolute;
    left: 0px;
    top: 56px;
  }

  .flowchart .node > .node-error {
    position: absolute;
    left: 0px;
    top: -24px;
    color: $negative;
  }

  .flowchart.jtk-surface {
    touch-action: auto;
  }

  @media (max-width: $breakpoint-xs)
    .leftMenu:not(.enabled) {
      display: none;
    }

    .leftMenu {
      width: 100%;
      border-right: none;
    }

    .main {
      left: 0px !important;
      right: 0px !important;
    }

    .rightMenu {
      width: 100%;
      border-left: none;
    }

    .flowchart .node.active > .node-btns {
      display: block;
    }

</style>

<style>

.flowchart .jtk-connector {
    z-index: 4;
}

.flowchart .jtk-endpoint, .endpointInputLabel, .endpointOutputLabel {
    z-index: 21;
    cursor: pointer;
}

.flowchart .endpointInputLabel, .flowchart .endpointOutputLabel {
    font-size: 12px;
    width: 50px;
    background-color: white;
    opacity: 0.5;
}

.flowchart .endpointInputLabel {
    text-align: right;
}

.flowchart .endpointOutputLabel {
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

.flowchart path, .jtk-endpoint {
    cursor: pointer;
}

.jtk-overlay {
    /*background-color:transparent;*/
}

</style>
