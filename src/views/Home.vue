<template>
  <div class="home">
    <div class="progressBar" />
    <div class="hero">
      <h1>Familjen Beckman</h1>
    </div>
    <ul class="posts">
      <li v-if="posts.length === 0" class="loadingPost">
        Loading...
      </li>
      <li v-for="post in posts" :key="post.$index" class="post" :class="{onDesktop: !isMobile}">
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
    if (this.$root.posts) {
      this.posts = this.$root.posts
    } else {
      this.$http.get('posts').then(response => {
        this.$root.posts = response.body
        this.posts = response.body
        console.log(this.$root)
      }, err => {
        // error callback
        console.error(err)
      })
    }
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
.progressBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: 3px;
  background: fade(darken(#9AA, 10%), 25%);
}
.hero {
  background: lighten(#2c3e50, 10%);
  background-image: svg-gradient(to bottom right, lighten(saturate(#9AA, 30%), 10%), lighten(saturate(#9AA, 30%), 30%));
  background-size: cover;
  color: lighten(#2c3e50, 100%);
  padding: 2vh 0;
  margin: 0 0 5vh;
  text-align: center;
  h1 {
    color: inherit;
    opacity: 0.87;
    text-shadow: 0 2px 18px fade(darken(saturate(#9AA, 50%), 20%), 60%);
  }
}
.posts {
  > li {
    position: relative;
    list-style: none;
    text-align: center;
    margin: .5rem auto;
    width: 95vw;
    max-width: 650px;
    &.loadingPost {
      font-style: italic;
      opacity: 0.54;
    }
    &.post {
      font-size: 2rem;
      font-weight: 900;
      letter-spacing: -.04em;
      padding: 3rem 1rem .75rem;
      text-align: left;
      background: lighten(#2c3e50, 10%);
      overflow: hidden;
      border-radius: 4px;
      transition: all .3s;
    }
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
