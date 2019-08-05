<template>
  <div>

    <q-list>
      <q-expansion-item expand-separator icon="keyboard_arrow_right" :label="operation.name" :caption="operationReturnToString(operation)" v-for="operation in operations" :key="operation.name">

        <q-card class="content">
          <q-card-section v-if="operation.description">
            <vue-markdown class="markdown text-faded" :anchorAttributes="{target: '_blank'}">{{ operation.description }}</vue-markdown>
          </q-card-section>

          <q-card-section v-if="hasParameters(operation)">
            <form-schema :schema="operation.schema" v-model="operation.model" @error="operation.inputError = $event"/>
          </q-card-section>

          <q-card-section>
              <q-btn :loading="operation.loading" :disable="operation.inputError" color="primary" icon="done" label="execute" @click="execute(operation)"/>
          </q-card-section>

          <q-card-section v-if="operation.error">
            <q-banner
                class="bg-red text-white"
            >
              <q-icon left name="mdi-alert"/> {{ String(operation.error) }}
            </q-banner>
          </q-card-section>

          <q-card-section class="result" v-if="operation.result">
            <img v-if="operation.resultType === 'image'" :src="operation.result" @load="operation.loading = false" @error="operation.loading=false; operation.error='an error occured'; operation.result=null" />
            <audio v-else-if="operation.resultType === 'audio'" controls :src="operation.result" :type="operation.resultContentType" />
            <video v-else-if="operation.resultType === 'video'" controls autoplay :src="operation.result" :type="operation.resultContentType" />
            <object v-else-if="operation.resultType === 'videoflash'" width="425" height="300" class="videoplayer" data="http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf" type="application/x-shockwave-flash">
              <param name="movie" value="http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf" />
              <param name="allowfullscreen" value="true" />
              <param name="allowscriptaccess" value="always" />
              <param name="flashvars" :value="'config={\"clip\":{\"url\":\"' + operation.result + '\"},\"playlist\":[{\"url\":\"' + operation.result + '\"}]}'" />
            </object>
            <pre v-else-if="operation.resultType === 'json'" v-highlightjs><code class="json">{{ operation.result }}</code></pre>
            <pre v-else-if="operation.resultType === 'html'" v-highlightjs><code class="html">{{ operation.result }}</code></pre>
            <pre v-else-if="operation.resultType === 'xml'" v-highlightjs><code class="xml">{{ operation.result }}</code></pre>
            <pre v-else-if="operation.resultType === 'text'"><code class="plain">{{ operation.result }}</code></pre>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

  </div>
</template>

<script>
import EThing from 'ething-js'
import VueMarkdown from 'vue-markdown'
import Vue from 'vue'

var supportsAudioPlayback = function (contentType) {
  var audioElement = document.createElement('audio')
  return !!(audioElement.canPlayType && audioElement.canPlayType(contentType).replace(/no/, ''))
}

var supportsVideoPlayback = function (contentType) {
  var videoElement = document.createElement('video')
  return !!(videoElement.canPlayType && videoElement.canPlayType(contentType).replace(/no/, ''))
}

var blobToText = function(blob, cb){
	if (blob instanceof Blob) {
		var reader = new window.FileReader()
		reader.readAsText(blob)
		reader.onloadend = function() {
			cb(reader.result)
		}
	} else {
		cb(blob)
	}
}

export default {
    name: 'DeviceApi',

    components: {
      VueMarkdown
    },

    props: ['device'],

    data () {
        return {
          operations: [],
          _resourceId: null
        }
    },

    watch: {
      device : {
        handler (resource) {
          if (resource && this._resourceId != resource.id()) {
            this.buildApi()
          }
        },
        immediate: true
      }
    },

    methods: {

      buildApi () {
        var methods = this.$ethingUI.get(this.device).methods
        var operations = []

        for(let name in methods) {
          let method = methods[name]

          operations.push({
            name,
            description: method.description,
            return: method.return,
            inputError: false,
            error: false,
            loading: false,
            ts: 0,
            result: null,
            resultType: null,
            resultContentType: null,
            schema: {
              additionalProperties: false,
              properties: method.arguments,
              required: method.required,
              type: 'object'
            },
            model: {}
          })
        }

        this.operations = operations
      },

      hasParameters (operation) {
        return Object.keys(operation.schema.properties || {}).length
      },

      operationReturnToString (operation) {
        var ret = operation.return
        if (typeof ret === 'string' ) {
          return ret
        } else if (typeof ret === 'object' && ret !== null) {
          return ret.type
        } else {
          return ''
        }
      },

      execute (operation) {

        var contentType = operation.return

        operation.ts = Date.now()
        operation.error = false
        operation.loading = true
        operation.result = null
        operation.resultType = null
        operation.resultContentType = null


        // MJPEG
    		if (/^image\//.test(contentType) || /^multipart\/x-mixed-replace/.test(contentType) || contentType=='video/x-motion-jpeg' || contentType=='video/x-jpeg') {
          operation.result = this.toUrl(operation) + '&_ts=' + operation.ts
          operation.resultType = 'image'
    		}
    		else if (/^audio\//.test(contentType) && supportsAudioPlayback(contentType)) {
          operation.resultContentType = contentType
          operation.result = this.toUrl(operation) + '&_ts=' + operation.ts
          operation.resultType = 'audio'
          operation.loading = false
    		}
    		else if (/^video\//.test(contentType)) {
    			if(supportsVideoPlayback(contentType)){
            operation.resultContentType = contentType
            operation.result = this.toUrl(operation) + '&_ts=' + operation.ts
            operation.resultType = 'video'
    			} else {
    				// flv ...
            operation.result = this.toUrl(operation) + '&_ts=' + operation.ts
            operation.resultType = 'videoflash'
    			}
          operation.loading = false
    		}
    		else {
    			// get the content as Blob
          this.device.execute(operation.name, operation.model, 'blob').then( (blobData) => {

            operation.loading = false

            var contentType = blobData.type

            if (!blobData || blobData.size == 0) {
    					operation.result = null
              operation.resultType = 'empty'
    				  // JSON
    				} else if (/json/.test(contentType)) {

    					blobToText(blobData, data => {

    						try {
    							operation.result = JSON.stringify(JSON.parse(data), null, '  '); // make it beautiful
                  operation.resultType = 'json'
    						} catch (_error) {
                  operation.error = 'can\'t parse JSON.  Raw result:\n\n' + data
    						}

    					});

    				  // HTML
    				} else if (contentType === 'text/html') {

    					blobToText(blobData, data => {
                operation.result = data
                operation.resultType = 'html'
    					});

    				  // xml
    				} else if (/xml/.test(contentType)) {

    					blobToText(blobData, data => {
                operation.result = data
                operation.resultType = 'xml'
    					});

    				  // Plain Text
    				} else if (/text/.test(contentType)) {

    					blobToText(blobData, data => {
                operation.result = data
                operation.resultType = 'text'
    					});

    				  // Image
    				} /*else if (/^image\//.test(contentType)) {

    					// build an image from the blob data
    					var imageUrl = ( window.URL || window.webkitURL).createObjectURL( blobData );
    					var image = new Image();
    					image.src = imageUrl;
    					success( $(image) );

    				  // Audio
    				} else if (/^audio\//.test(contentType) && supportsAudioPlayback(contentType)) {
    					success( $('<audio controls>').append($('<source>').attr('src', self.toUrl(parameters)).attr('type', contentType)) );

    				  // video
    				} else if (/^video\//.test(contentType)) {
    					if(supportsVideoPlayback(contentType)){
    						success( $('<video controls autoplay>').append($('<source>').attr('src', this.toUrl(parameters)).attr('type', contentType)) );
    					} else {
    						// flv ...
    						var src = this.toUrl(parameters);
    						success( $('<object width="425" height="300" class="videoplayer" data="http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf" type="application/x-shockwave-flash"><param name="movie" value="http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="flashvars" value=\'config={"clip":{"url":"'+src+'"},"playlist":[{"url":"'+src+'"}]}\' /></object>') );
    					}
    				}*/ else {
              operation.error = 'Unable to render the response'
            }

          }).catch( err => {
            operation.error = err
          }).finally( () => {
            operation.loading = false
          })


        }

      },

      toUrl (operation) {
        var url = 'devices/'+this.device.id()+'/call/'+operation.name;

    		if(operation.model){
    			url += '?'+ this.$ething.utils.param(operation.model);
    		}

    		return this.$ething.toApiUrl(url,true);
      },

    }

}
</script>

<style lang="stylus" scoped>

  @media (min-width: $breakpoint-xs)
    .content
      margin-left 3 * $space-y-base

  .result
    img
      width auto
      max-width 100%
    video, object
      width auto
      max-width 100%
</style>
