<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"><i class="fa fa-arrow-left" /></router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
@import (css) url('https://rsms.me/inter/inter-ui.css');
@import '../node_modules/reset-css/less/reset';
* { box-sizing: border-box; }
html {
  font-size: 16px;
  line-height: 1.5em;
  letter-spacing: -0,004em;
}
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Inter UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
  font-size: 2rem;
  margin: 1rem;
  font-weight: 800;
  text-align: center;
  color: lighten(#2c3e50, 20%);
}
</style>
