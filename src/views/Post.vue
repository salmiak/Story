<template>
  <div>
    <div class="progressBar">
      <div class="progressBarIndicator" :style="{width: sliderProgress+'%'}" />
    </div>
    <div class="carouselContainer">
      <carousel v-if="post.images && post.images.length" :perPage="1" :paginationEnabled="false" :navigationEnabled="true" @pageChange="updateCurrentImgIndex" ref="imageCarousel">

        <slide v-for="img in post.images" :key="img.$index" class="imgSlide">
          <img :src="$http.options.root + '/image/w1024h768' + img"  />
        </slide>

        <slide v-if="nextPost">
          <div class="lastSlideContent">
            <p>Next post</p>
            <h2>
              <router-link :to="'/post' + nextPost.path">{{nextPost.name}}</router-link>
            </h2>
          </div>
        </slide>

      </carousel>
      <div class="bgImage" v-bind:style="containerStyle" />
    </div>

    <div class="bodyContent">
      <h1>{{title || 'Loading...'}}</h1>
      <div v-if="post.info.date" class="postDate">&mdash; {{post.info.date | formatDate}} &mdash;</div>
      <vue-markdown :watches="['post.post']" :source="post.post"></vue-markdown>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import VueMarkdown from 'vue-markdown'
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'post',
  components: {
    VueMarkdown,
    Carousel,
    Slide
  },
  data () {
    return {
      post: {
        info: {}
      },
      currentImgIndex: 0
    }
  },
  beforeCreate () {
    this.$http.get('posts/' + this.$route.params.path).then(response => {
      this.post = response.body
      window.addEventListener('keyup', this.keyPress)
    }, err => {
      // error callback
      console.error(err)
    })
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.keyPress)
  },
  computed: {
    title () {
      if (!this.post.name) {
        return ''
      }
      return this.post.info.title || this.post.info.name || this.post.name
    },
    containerStyle () {
      if (!this.post.name) {
        return {}
      }
      return {
        'background-image': 'url(\'' + this.$http.options.root + '/image/w1024h768' + this.post.images[this.currentImgIndex] + '\')'
      }
    },
    nextPost () {
      var index = _.findIndex(this.$root.posts, (post) => {
        return post.path === '/' + this.$route.params.path
      })
      if (index === -1) {
        return undefined
      }
      return this.$root.posts[index + 1]
    },
    sliderProgress () {
      if (!this.post.images) {
        return 0
      }
      return 100 * (this.currentImgIndex + 1) / this.post.images.length
    }
  },
  methods: {
    updateCurrentImgIndex (index) {
      this.currentImgIndex = Math.min(index, this.post.images.length - 1)
    },
    keyPress (e) {
      if (e.keyCode === 37) {
        console.log('left')
        this.$refs.imageCarousel.advancePage('backward')
      }
      if (e.keyCode === 39) {
        console.log('right')
        this.$refs.imageCarousel.advancePage('forward')
      }
    }
  }
}
</script>

<style lang="less">
.progressBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: 3px;
  background: darken(#9AA, 10%);
  &Indicator {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 0;
    transition: width 0.7s;
    background: lighten(saturate(#9AA, 70%), 10%);
  }
}
img {
  max-width: calc(100vw - 60px);
  max-height: 100vh;
  height: auto;
  width: auto;
}
.carouselContainer {
  width: 100vw;
  min-height: 30vh;
  background: #9AA;
  background-image: svg-gradient(to bottom right, lighten(#9AA, 10%), darken(#9AA, 10%));
  background-size: cover;
  position: relative;
  overflow: hidden;
  .bgImage {
    position: absolute;
    top: -20px;
    bottom: -20px;
    left: -20px;
    right: -20px;
    z-index: 0;
    background-size: cover;
    background-position: 50% 50%;
    filter: blur(15px);
    opacity: 0.5;
  }
}
.VueCarousel {
  position: relative;
  z-index: 100;
  width: calc(100vw - 60px);
  margin: 0 auto;
  &-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.imgSlide {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bodyContent {
  position: relative;
  max-width: 650px;
  width: 96vw;
  margin: -15px auto 0;
  background: #F9F9F9;
  border-radius: 4px;
  z-index: 400;
  padding: 10px 20px 10px;
  box-shadow: 0 0 35px fade(darken(saturate(#9AA, 40%), 25%), 15%), 0 0 0 1px #FFF inset;
}
.postDate {
  text-align: center;
  margin-bottom: 1.2rem;
  font-size: 0.7rem;
}
.lastSlideContent {
  text-align: center;
  color: #FFF;
  a {
    color: #FFF;
    text-decoration: none;
  }
}

</style>
