<template>
  <div class="home">
    <h1>Beckmans Story</h1>
    <h2>Powered by a Dropbox app</h2>
    <p>
      Posts goes here
    </p>
    <ul>
      <li v-for="post in posts" :key="post.$index">
        <router-link :to="post.path">{{post.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

var apiRoot = 'http://localhost:8081'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    this.$http.get(apiRoot + '/posts').then(response => {
      // success callback
      console.log(response)
      this.posts = response.body
    }, err => {
      // error callback
      console.error(err)
    })
  }
}
</script>
