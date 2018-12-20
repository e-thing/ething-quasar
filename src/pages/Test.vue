<template>
  <q-page padding>

    <q-btn label="add node" @click="addNodeToFlow({type:'event', model:{type:'events/CustomEvent', name:'toto'}})" />

    <q-btn label="add event" @click="addNodeClick('event')" />
    <q-btn label="add condition" @click="addNodeClick('condition')" />
    <q-btn label="add action" @click="addNodeClick('action')" />

    <q-btn label="export" @click="exportFlow" />

    <div ref="flowchart" class="flowchart jtk-surface jtk-surface-nopan">
        <div ref="node" class="node" :class="node.type" v-for="node in nodes" :key="node.id" :data-id="node.id">
          <strong>{{ nodeTitle(node) }}</strong>
          <q-btn flat dense icon="edit" size="sm" color="faded"  @click="editNode(node)" />
        </div>
    </div>

    <modal v-model="edit.show" :title="'Add '+edit.type" icon="add" :valid-btn-disable="edit.error" valid-btn-label="Add" @valid="onEditDone">
      <form-schema :schema="{format: 'ething.' + edit.type}" v-model="edit.model" @error="edit.error = $event"/>
    </modal>

  </q-page>
</template>

<script>

//var jsPlumb = require("jsplumb")
import { jsPlumb } from 'jsplumb'
import 'jsplumb/css/jsplumbtoolkit-defaults.css'


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
  name: 'PageTest',

  data () {



    return {
      instance: null,
      nodes: [],
      edit: {
        type: null,
        show: false,
        model: undefined,
        error: false,
        node: null
      }
    }

  },

  methods: {
    addNodeToFlow (node, done) {
      if (!this.instance) return

      if (typeof node.id === 'undefined')
        node.id = this.getId()

      if (typeof node.type === 'undefined')
        throw 'no node.type defined'

      if (typeof node.x === 'undefined')
        node.x = 0

      if (typeof node.y === 'undefined')
        node.y = 0

      this.nodes.push(node)

      this.$nextTick(() => {
        var el = this.getNodeElement(node.id)

        node.el = el

        el.style.left = node.x+'px'
        el.style.top = node.y+'px'

        this.instance.batch(() => {

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

          this.instance.draggable(el, { grid: [20, 20] });
        })

        if (done) done(node)

      })

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

    addNodeClick (type) {
      this.edit.node = null
      this.edit.type = type
      this.edit.model = undefined
      this.edit.error = false
      this.edit.show = true
    },

    editNode (node) {
      this.edit.node = node
      this.edit.type = node.type
      this.edit.model = node.model
      this.edit.error = false
      this.edit.show = true
    },

    onEditDone () {
      this.edit.show = false
      if (this.edit.node) {
        this.edit.node.model = this.edit.model
      } else {
        this.addNodeToFlow({
          type: this.edit.type,
          model: this.edit.model
        })
      }
    },

    nodeTitle (node) {
      if (node.model) {
        return node.model.type.split('/').pop()
      }
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

    importFlow (flowData) {
      if (!this.instance) return

      flowData.nodes.forEach(nodeData => {
        this.addNodeToFlow(nodeData)
      })

      flowData.connections.forEach(connectionData => {
        var src = connectionData.src
        var dest = connectionData.dest

        this.instance.connect({uuids: [src[0] + '.outputs.' + src[1], dest[0] + '.inputs.' + dest[1]], editable: true});
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
    instance.batch(function () {

        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });

        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", function (conn, originalEvent) {
            if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                instance.deleteConnection(conn);
        });

        /*instance.bind("connectionDrag", function (connection) {
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });*/
    });

    //jsPlumb.fire("jsPlumbDemoLoaded", instance);

    this.addNodeToFlow({type:'event', model:{type:'events/CustomEvent', name:'toto'}, x:250, y:300})
    this.addNodeToFlow({type:'action', model:{type:'actions/Wait', duration:1000}, x:550, y:300})
  }
}
</script>

<style>

.flowchart {
    height: 550px;
    max-height: 700px;
    border: 1px solid #CCC;
    background-color: white;
    display: flex;
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

.flowchart .node.event {
  border-color: #873489;
}

.flowchart .node.condition {
  border-color: #a91c1c;
}

.flowchart .node.action {
  border-color: #346789;
}
</style>
