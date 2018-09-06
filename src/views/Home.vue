<template>
  <div class="home">
    <div class="hero">
      <h1>The Beckman's Story</h1>
    </div>
    <ul class="posts">
      <li v-for="post in posts" :key="post.$index">
        <router-link :to="'/post' + post.path">{{post.name}} <span class="smallDate">{{post.date | formatDate}}</span></router-link>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    this.$http.get('posts').then(response => {
      this.posts = response.body
    }, err => {
      // error callback
      console.error(err)
    })
  }
}
</script>

<style lang="less" scoped>
.hero {
  background: lighten(#2c3e50, 10%);
  background-image: svg-gradient(to bottom right, lighten(#2c3e50, 3%), darken(#2c3e50, 3%));
  background-size: cover;
  color: #FFF;
  padding: 5vh 0;
  margin: 0 0 5vh;
  text-align: center;
  h1 {
    color: #FFF;
  }
}
.posts {
  > li {
    list-style: none;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -.04em;
    margin: 0 0 1rem;
    a {
      color: inherit;
      text-decoration: none;
    }
    .smallDate {
      font-size: .8rem;
      font-weight: 300;
      letter-spacing: 0.004em;
      opacity: 0.54;
    }
  }
}
</style>
