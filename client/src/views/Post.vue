<template>
  <div>
    <h1>{{title}}</h1>

    <carousel :perPage="1" :paginationEnabled="false" :navigationEnabled="true">
      <slide v-for="img in post.images" :key="img.$index">
        <img :src="'http://localhost:8081/image/w2048h1536' + img"  />
      </slide>
    </carousel>


    <vue-markdown :watches="['post.post']" :source="post.post"></vue-markdown>
  </div>
</template>

<script>
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
      }
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
    }
  }
}
</script>

<style lang="less">
img {
  max-width: 90vw;
  max-height: 70vh;
  height: auto;
  width: auto;
}
.VueCarousel {
  width: 90vw;
  margin: 0 auto;
}
</style>
