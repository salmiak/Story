<template>
  <div id="app">
    <div id="nav">
      <router-link v-if="$route.name!=='home'" to="/"><i class="fa fa-arrow-left" /></router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
@import (css) url('https://rsms.me/inter/inter-ui.css');
@import (css) url('https://fonts.googleapis.com/css?family=Merriweather:300,300i,700,700i');
@import '../node_modules/reset-css/less/reset';
* { box-sizing: border-box; }
html {
  font-size: 22px;
  line-height: 1.5em;
  letter-spacing: -0,004em;
  background: darken(#2c3e50, 5%);
}
body {
  padding: 0;
  margin: 0;
  background: #F9F9F9;
  padding-bottom: 20px;
  min-height: 100vh;
  min-width: 100vw;
}
#app {
  font-family: 'Inter UI', sans-serif;
  font-feature-settings: "calt", "ss01", "case";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: lighten(#2c3e50, 10%);
}
#nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  z-index: 900;
  text-shadow: 0 0 fade(black, 30%);
  a {
    font-weight: bold;
    color: #FFF;
    text-decoration: none;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
h1 {
  font-size: 3rem;
  margin: 2rem 0 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
  color: #2c3e50;
}
p {
  line-height: 1.5em;
  margin-bottom: 1.3em;
  font-family: 'Merriweather', serif;
  font-weight: 300;
  opacity: 0.87;
  &:first-of-type {
    font-size: 1.2rem;
    font-style: italic;
    opacity: 0.54;
  }
}
</style>
