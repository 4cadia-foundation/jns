<template>
  <div class="header">
    <router-link to="/" class="header_logo">
      <img class="logo" :src="`${this.logo}`">
      <span class="title logo">{{ this.title }}</span>
    </router-link>
    <div :class="`header_menu ${this.showMenu ? 'open' : ''}`">
      <v-menu :menu="this.menu"/>
      <!-- <identity /> -->
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Identity from '@/components/Identity'
import BaseMenu from '@/components/BaseMenu'
export default {
  name: 'Header',
  components: {
    'identity': Identity,
    'v-menu': BaseMenu
  },
  data () {
    return {
      showMenu: false,
      menu: [],
      logo: '',
      title: ''
    }
  },
  methods: {
    toggleShowMenu: function (value) {
      this.showMenu = !this.showMenu
    }
  },
  mounted: function () {
    contentService('header').then((response) => {
      this.menu = response.data.menu
      this.logo = response.data.logo
      this.title = response.data.title
    })
  }
}
</script>

<style scoped>
.header {
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  background: white;
}
.header_logo {
  text-decoration: none;
}
.header_logo .logo {
  width: 25px;
}
.header_logo .logo,
.header_logo .title {
  display: inline-block;
  vertical-align: middle;
}
.header_logo .title {
  margin: 0 0 0 10px;
}
.header_menu {
  display: flex;
}
</style>
