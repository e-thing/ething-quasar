<template>
    <div class="card-carousel" :class="{ hasThumbnails: thumbnails, noTitle: !noTitle }" >
        <div class="card-img">
            <div class="img-wrapper">
                <div v-if="currentImage">
                  <img :key="imgKey" :src="addTimestampToUrl(currentImage.getSrc())" alt="" @load="onload" @error="onerror">
                  <div v-if="loading" class="loader text-center">loading...</div>
                  <div v-if="error" class="error text-center text-negative">Error</div>
                  <div v-if="!noTitle" class="title text-center text-faded">{{ currentImage.name() }}</div>
                </div>
            </div>
            <div class="actions" v-if="controls && images.length>1">
                <q-btn round flat size="lg" icon="chevron left" @click="prevImage" class="prev"/>
                <q-btn round flat size="lg" icon="chevron right" @click="nextImage" class="next"/>
            </div>
        </div>
        <div class="thumbnails" v-if="thumbnails && images.length>1">
            <div
                v-for="(image, index) in  images"
                :key="index"
                :class="['thumbnail-image', (activeImage == index) ? 'active' : '']"
                @click="activateImage(index)"
            >
                <img :src="image.getThumbSrc(image)">
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'ImageViewer',

  props: {
    /*
    source:
      - File: image
    */
    source: {},
    value: {},
    thumbnails: Boolean,
    controls: Boolean,
    noTitle: Boolean
  },

  data() {
    return {
        //Index of the active image on the images array
        activeImage: 0,
        images: [],
        imgKey: 0,
        loading: false
    }
  },
  computed: {
      // currentImage gets called whenever activeImage changes
      // and is the reason why we don't have to worry about the
      // big image getting updated
      currentImage () {
          return this.images[this.activeImage]
      },

  },

  watch: {
    source (src) {
      this.setSource(src)
    },
    value (val) {
      this.activateImage (val)
    },
    activeImage : {
      handler () {
        this.loading = true
        this.error = false
      },
      immediate: true
    }
  },

  mounted () {
    this.setSource(this.source)
    if (this.value) {
      this.activateImage(this.value)
    }
  },

  methods: {

      setSource (source) {
        if (Array.isArray(source)) {
          this.images = source.map(s => this.parseSource(s)).filter(s => !!s)
        } else {
          var image = this.parseSource(source)
          this.images = []
          if (image) {
            this.images.push(image)
          }
        }
      },

      // Go forward on the images array
      // or go at the first image if you can't go forward :/
      nextImage() {
        var active = this.activeImage + 1
        if(active >= this.images.length) {
            active = 0
        }
        this.activateImage(active)
      },

      // Go backwards on the images array
      // or go at the last image
      prevImage() {
        var active = this.activeImage - 1
        if(active < 0) {
            active = this.images.length - 1
        }
        this.activateImage(active)
      },

      activateImage(imageIndex) {
        if (typeof imageIndex == 'number') {
          this.activeImage = imageIndex
          this.$emit('input', this.images[this.activeImage].source)
        } else {
          var index = this.images.findIndex(s => {
            return s.source === imageIndex
          })
          if (index !== -1) {
            this.activeImage = index
          }
        }

      },

      refresh () {
        this.loading = true
        this.error = false
        this.imgKey += 1
      },

      parseSource (source) {
        var obj = {}

        if (/^https?:\/\//.test(source)) {
          obj = {
            type: 'url',
            getSrc () {
              return source
            },
            name () {
              return source
            }
          }
        } else if (source instanceof this.$ething.File) {
          obj = {
            type: 'resource.File',
            getSrc () {
              return source.getContentUrl(false)
            },
            getThumbSrc () {
              return source.thumbnailLink(false)
            },
            name () {
              return source.name()
            }
          }
        }

        obj.source = source

        return obj
      },

      addTimestampToUrl (url) {
        return url + ( url.indexOf('?') === -1 ? '?' : '&' ) + Date.now()
      },

      onload () {
        this.loading = false
        this.error = false
      },

      onerror (err) {
        this.loading = false
        this.error = true
      }
  }

}
</script>

<style scoped>
.card-carousel {
    user-select: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.thumbnails {
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
    position: absolute;
    bottom: 0;
    width: 100%;
}

.thumbnail-image {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 2px;
}

.thumbnail-image > img {
    width: 100%;
    height: auto;
    transition: all 250ms;
}

.thumbnail-image:hover > img,
.thumbnail-image.active > img {
    opacity: 0.6;
    box-shadow: 2px 2px 6px 1px rgba(0,0,0, 0.5);
}

.card-img {
    position: absolute;
    top: 0;
    bottom: 0px;
    width: 100%;
    overflow-x: hidden;
}

.card-carousel.hasThumbnails .card-img {
  bottom: 132px;
}

.card-img > div.img-wrapper {
    position: absolute;
    width: 200%;
    text-align: center;
    height: 100%;
}

.card-img > div.img-wrapper > div {
    height: 100%;
    float: left;
    position: relative;
    overflow: hidden;
    width: 50%;
}

.card-img > div.img-wrapper > div:before {
    content: ' ';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
}

.card-img > div.img-wrapper > div > img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    display: inline-block;
    vertical-align: middle;
}

.card-img.hasTitle > div.img-wrapper > div > img {
    padding: 30px;
}


.title {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 5px 0;
}

.loader {
    position: absolute;
    bottom: 50%;
    width: 100%;
}

.error {
    position: absolute;
    bottom: 50%;
    width: 100%;
}

.actions {
    font-size: 1.5em;
    height: 40px;
    position: absolute;
    top: 50%;
    margin-top: -20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #585858;
}

</style>
