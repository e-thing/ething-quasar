<template>
    <div class="card-carousel" :class="{ hasThumbnails: thumbnails }" >
        <div class="card-img">
            <div class="absolute-center">
              <img :src="currentImageSrc" alt="">
              <div v-if="!noTitle" class="title text-center">{{ currentImage.name() }}</div>
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

          console.log('currentImage', this.images[this.activeImage].id(), this.images)
          return this.images[this.activeImage]
      },

      currentImageSrc () {
          console.log('currentImageSrc')
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
        console.log('nextImage')
          var active = this.activeImage + 1;
          if(active >= this.images.length) {
              active = 0;
          }
          this.activateImage(active);
      },
      // Go backwards on the images array
      // or go at the last image
      prevImage() {
        console.log('prevImage')
          var active = this.activeImage - 1;
          if(active < 0) {
              active = this.images.length - 1;
          }
          this.activateImage(active);
      },
      activateImage(imageIndex) {
          console.log('activateImage', imageIndex)
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
    margin-bottom: 15px;
    position: absolute;
    top: 0;
    width: 100%;
    bottom: 0px;
}

.card-carousel.hasThumbnails .card-img {
  bottom: 150px;
}

.card-img > img {
    display: block;
    margin: 0 auto;
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
