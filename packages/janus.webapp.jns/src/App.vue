<template>
  <div id="app">
    <!-- <v-modal ref="modal"></v-modal> -->
    <v-header/>
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header'

export default {
  name: 'App',

  components: {
    'v-header': Header,
  },
  
  created(){
    this.$store.dispatch('resolveJanusNameService')  
  },
}
</script>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/fonts.css';
@import './assets/styles/typography.css';
@import './assets/styles/base.css';
@import './assets/styles/utils.css';
#app {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
