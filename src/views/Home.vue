<template>
  <div class="home">
    <div class="hero">
      <h1>The Beckman's Story</h1>
    </div>
    <ul class="posts">
      <li v-for="post in posts" :key="post.$index" :class="{onDesktop: !isMobile}">
        <router-link :to="'/post' + post.path">
          <div v-if="post.firstImage" v-bind:style=" { 'backgroundImage' : 'url(\'' + $http.options.root + '/image/w960h640' + post.firstImage.path_lower + '\')' }" class="postCover" />
          <span class="postTitle">{{post.name}} <span class="smallDate">{{post.date | formatDate}}</span></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import MobileDetect from 'mobile-detect'

export default {
  name: 'home',
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    this.$http.get('posts').then(response => {
      this.$root.posts = response.body
      this.posts = response.body
      console.log(this.$root)
    }, err => {
      // error callback
      console.error(err)
    })
  },
  computed: {
    isMobile () {
      var md = new MobileDetect(window.navigator.userAgent)
      return md.mobile()
    }
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
    position: relative;
    list-style: none;
    text-align: center;
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -.04em;
    margin: .5rem auto;
    padding: 3rem 1rem .75rem;
    width: 95vw;
    max-width: 650px;
    text-align: left;
    background: lighten(#2c3e50, 10%);
    overflow: hidden;
    border-radius: 4px;
    transition: all .3s;
    a {
      text-decoration: none;
    }
    .postTitle {
      color: #FFF;
      text-decoration: none;
      z-index: 100;
      position: relative;
      transition: all .3s;
    }
    .smallDate {
      font-size: .8rem;
      font-weight: 300;
      letter-spacing: 0.004em;
      opacity: 0.54;
      white-space: nowrap;
      transition: all .3s;
    }
    .postCover {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      z-index: 0;
      background-size: cover;
      background-position: 50% 50%;
      opacity: 0.54;
      filter: blur(5px);
      transition: all .5s;
    }
    &.onDesktop:hover {
      padding: 3*3rem 1rem .75rem;
      .postTitle {
        opacity: 0.35;
      }
      .smallDate {
        opacity: 0.35;
      }
      .postCover {
        filter: blur(0);
        opacity: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>
