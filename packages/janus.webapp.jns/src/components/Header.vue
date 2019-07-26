<template>
  <div class="header">
    <router-link to="/" class="header_logo">
      <img class="logo" :src="`${this.logo}`">
      <span class="title logo">{{ this.title }}</span>
    </router-link>
    <div :class="`header_menu ${this.showMenu ? 'open' : ''}`">
      <v-menu :menu="this.menu"/>
      <account />
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Account from '@/components/Account'
import Menu from '@/components/Menu'
export default {
  name: 'Header',
  components: {
    'account': Account,
    'v-menu': Menu
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
</style>
