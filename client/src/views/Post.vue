<template>
  <div>
    <h1>{{title}}</h1>
    <img v-for="img in post.images" :key="img.$index" :src="'http://localhost:8081/image/w32h32' + img" />
    <p>
      {{post.post}}
    </p>
    <vue-markdown :watches="['post.post']">{{post.post}}</vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'post',
  components: {
    VueMarkdown
  },
  data () {
    return {
      post: {}
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
      if (!this.post.name)
        return 'Loading...'
      return this.post.info.Name || this.post.name
    }
  }
}
</script>
