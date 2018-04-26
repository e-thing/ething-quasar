<template>
    <div class="card-carousel" :class="{ hasThumbnails: thumbnails, noTitle: !noTitle }" >
        <div class="card-img">
            <div class="img-wrapper">
                <div class="">
                  <img :src="currentImageSrc" alt="">
                  <div v-if="!noTitle" class="title text-center text-faded">{{ currentImage.name() }}</div>
                </div>
            </div>
            <div class="actions" v-if="controls">
                <q-btn round flat size="lg" icon="chevron left" @click="prevImage" class="prev"/>
                <q-btn round flat size="lg" icon="chevron right" @click="nextImage" class="next"/>
            </div>
        </div>
        <div class="thumbnails" v-if="thumbnails">
            <div
                v-for="(image, index) in  images"
                :key="index"
                :class="['thumbnail-image', (activeImage == index) ? 'active' : '']"
                @click="activateImage(index)"
            >
                <img :src="getThumbSrc(image)">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ImageViewer',

    props: {
      source: {},
      thumbnails: Boolean,
      controls: Boolean,
      noTitle: Boolean
    },

    data() {
      return {
          //Index of the active image on the images array
          activeImage: 0
      }
  },
  computed: {
      // currentImage gets called whenever activeImage changes
      // and is the reason why we don't have to worry about the
      // big image getting updated
      currentImage () {
          return this.images[this.activeImage]
      },

      currentImageSrc () {
          return this.currentImage.getContentUrl(false)
      },

      images () {
        var source = this.source
        var images = []

        if (typeof source === 'string') {
          source = this.$store.getters['ething/findOneById'](id)
        }

        if (source instanceof this.$ething.Resource) {

          if (source instanceof this.$ething.File) {
            images = source.parent().children(r => {
              return this.isImage(r)
            })
          } else if (source instanceof this.$ething.Folder) {
            images = source.children(r => {
              return this.isImage(r)
            })
          }

        }

        return images
      }
  },

  mounted () {
    if (this.source instanceof this.$ething.File) {
      this.activeImage = this.images.indexOf(this.source)
    }
  },

  methods: {

      isImage (r) {
        return r instanceof this.$ething.File && /image/.test(r.mime())
      },

      getThumbSrc (r) {
        return r.thumbnailLink(false)
      },

      // Go forward on the images array
      // or go at the first image if you can't go forward :/
      nextImage() {
        var active = this.activeImage + 1;
        if(active >= this.images.length) {
            active = 0;
        }
        this.activateImage(active);
      },
      // Go backwards on the images array
      // or go at the last image
      prevImage() {
        var active = this.activeImage - 1;
        if(active < 0) {
            active = this.images.length - 1;
        }
        this.activateImage(active);
      },
      activateImage(imageIndex) {
        this.activeImage = imageIndex;
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
