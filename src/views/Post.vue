<template>
  <div>
    <div class="carouselContainer">
      <carousel v-if="post.images && post.images.length" :perPage="1" :paginationEnabled="false" :navigationEnabled="true" @pageChange="updateCurrentImgIndex">
        <slide v-for="img in post.images" :key="img.$index" class="imgSlide">
          <img :src="$http.options.root + '/image/w1024h768' + img"  />
        </slide>
      </carousel>
      <div class="bgImage" v-bind:style="containerStyle" />
    </div>

    <div class="bodyContent">
      <h1>{{title}}</h1>
      <div v-if="post.info.Date" class="postDate">&mdash; {{post.info.Date | formatDate}} &mdash;</div>
      <vue-markdown :watches="['post.post']" :source="post.post"></vue-markdown>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
  mounted () {
    this.$http.get('posts/' + this.$route.params.path).then(response => {
      this.post = response.body
    }, err => {
      // error callback
      console.error(err)
    })
  },
  computed: {
    title () {
      if (!this.post.name) {
        return ''
      }
      return this.post.info.Name || this.post.name
    },
    containerStyle () {
      if (!this.post.name) {
        return {}
      }
      return {
        'background-image': 'url(\'' + this.$http.options.root + '/image/w1024h768' + this.post.images[this.currentImgIndex] + '\')'
      }
    }
  },
  methods: {
    updateCurrentImgIndex (index) {
      this.currentImgIndex = index
    }
  }
}
</script>

<style lang="less">
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
  background: #FFF;
  border-radius: 4px;
  z-index: 400;
  padding: 10px 20px 10px;
}
.postDate {
  text-align: center;
  margin-bottom: 1.2rem;
  font-size: 0.7rem;
}

</style>
