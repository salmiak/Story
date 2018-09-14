<template>
  <div>

    <div class="progressBar">
      <div class="progressBarIndicator" :style="{width: sliderProgress+'%'}" />
    </div>

    <div class="layoutSwitch">
      <i class="fal fa-th fa-fw" :class="{'active': layout === 'grid'}" @click="layout = 'grid'" />
      <i class="fal fa-portrait fa-fw" :class="{'active': layout === 'list'}" @click="layout = 'list'" />
      <i class="fal fa-images fa-fw" :class="{'active': layout === 'carousel'}" @click="layout = 'carousel'" />
    </div>

    <div v-if="layout === 'carousel'" class="carouselContainer">
      <carousel v-if="post.images && post.images.length" :perPage="1" :paginationEnabled="false" :navigationEnabled="true" @pageChange="updateCurrentImgIndex" ref="imageCarousel">

        <slide v-for="img in post.images" :key="img.$index" class="imgSlide">
          <img :src="$http.options.root + '/image/w1024h768' + img"  />
          <exif :path="img" />
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

    <div v-if="layout === 'grid'" ref="imgGrid" class="imgGrid">
      <masonry
        :cols="{default: 4, 1000: 3, 700: 2, 420: 1}"
        :gutter="3"
        >
        <img v-for="(img,idx) in post.images" :key="`img-${idx}`" :src="$http.options.root + '/image/w1024h768' + img"  />
      </masonry>
    </div>

    <div v-if="layout === 'list'" ref="imgList" class="imgList">
      <img v-for="(img,idx) in post.images" :key="`img-${idx}`" :src="$http.options.root + '/image/w1024h768' + img"  />
    </div>

    <div class="bodyContent" :class="{'small':!post.post}">
      <h1>{{title||'Loading...'}}</h1>
      <div v-if="post.info.date" class="postDate">&mdash; {{post.info.date | formatDate}} &mdash;</div>
      <vue-markdown :watches="['post.post']" :source="post.post"></vue-markdown>
    </div>

    <div v-if="nextPost" class="nextPost">
      <p>Next post: <router-link :to="'/post' + nextPost.path">{{nextPost.name}}</router-link></p>
    </div>

  </div>
</template>

<script>
import findIndex from 'lodash/findIndex'
import VueMarkdown from 'vue-markdown'
import { Carousel, Slide } from 'vue-carousel'
import Exif from '@/components/Exif'

export default {
  name: 'post',
  components: {
    VueMarkdown,
    Carousel,
    Slide,
    Exif
  },
  data () {
    return {
      post: {
        info: {}
      },
      currentImgIndex: 0,
      layout: 'grid',
      scrollProgress: 0
    }
  },
  mounted () {
    window.addEventListener('scroll', this.updateScrollProgress)
    window.addEventListener('keyup', this.keyPress)
    this.$http.get('posts/' + this.$route.params.path).then(response => {
      this.post = response.body
    }, err => {
      // error callback
      console.error(err)
    })
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.keyPress)
    window.removeEventListener('scroll', this.updateScrollProgress)
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
      var index = findIndex(this.$root.posts, (post) => {
        return post.path === '/' + this.$route.params.path
      })
      if (index === -1) {
        return undefined
      }
      return this.$root.posts[index + 1]
    },
    sliderProgress () {
      var progress = this.scrollProgress
      var curImg = this.currentImgIndex

      if (!this.post.images) { return 0 }

      if (this.layout === 'carousel') {
        return 100 * (curImg + 1) / this.post.images.length
      } else if (this.layout === 'grid') {
        return this.$refs.imgGrid ? 100 * progress / (this.$refs.imgGrid.clientHeight - window.visualViewport.height) : 0
      } else {
        return this.$refs.imgList ? 100 * progress / (this.$refs.imgList.clientHeight - window.visualViewport.height) : 0
      }
    }
  },
  methods: {
    updateScrollProgress () {
      this.scrollProgress = window.scrollY
    },
    updateCurrentImgIndex (index) {
      this.currentImgIndex = Math.min(index, this.post.images.length - 1)
    },
    keyPress (e) {
      if (e.keyCode === 37) {
        this.$refs.imageCarousel.advancePage('backward')
      }
      if (e.keyCode === 39) {
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
  background: fade(darken(#9AA, 10%), 25%);
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
.layoutSwitch {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 300;
  padding: calc(20px - 0.5rem);
  i {
    box-sizing: content-box;
    font-size: 1rem;
    line-height: 1.25em;
    color: fade(#FFF, 70%);
    padding: .5rem;
    background: fade(black, 10%);
    margin-right: 3px;
    cursor: pointer;
    transition: background .3s;
    &:hover {
      background: fade(black, 30%);
      color: #FFF;
    }
    &.active {
      color: #FFF;
      background: fade(black, 15%);
    }
    &:first-child {
      border-radius: .75rem 0 0 .75rem;
      padding-left: .6rem;
    }
    &:last-child {
      border-radius: 0 .75rem .75rem 0;
      padding-right: .6rem;
    }
  }
}
.carouselContainer {
  width: 100vw;
  min-height: 30vh;
  background: #9AA;
  background-image: svg-gradient(to bottom right, lighten(#9AA, 10%), darken(#9AA, 10%));
  background-size: cover;
  position: relative;
  overflow: hidden;
  padding: 10px 0 15px;
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
  img {
    max-width: calc(100vw - 60px);
    max-height: 100vh;
    height: auto;
    width: auto;
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
    > img {
      border-radius: 4px;
    }
    .exif {
      transform: translateY(5rem);
      transition: transform .5s;
    }
    &:hover .exif {
      transform: translateY(0);
    }
  }
}
.imgSlide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.imgGrid, .imgList {
  padding: 0 3px;
  min-height: 30vh;
  background: #9AA;
  background-image: svg-gradient(to bottom right, lighten(#9AA, 10%), darken(#9AA, 10%));
  background-size: cover;
  img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 3px;
    border-radius: 4px;
  }
}
.imgList {
  padding: 10px 3px;
  img {
    max-width: 650px;
    margin: 0 auto 6px;
  }
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
  &.small {
    padding: 10px 20px 10px;
    h1 {
      font-size: 1.2rem;
      font-weight: 300;
      margin: .5rem;
    }
  }
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
.nextPost {
  margin-top: 2rem;
  text-align: center;
  p {
    opacity: 0.87;
    font-size: 1rem;
  }
  &::before {
    content: '';
    border-bottom: 1px solid fade(#2c3e50, 54%);
    display: block;
    width: 3rem;
    margin: 0 auto 1.2rem;
  }
}

</style>
