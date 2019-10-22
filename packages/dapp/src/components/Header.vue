<template>
  <div class="header">
    <router-link to="/" class="header_logo">
      <img :src="`${logo}`" class="logo" />
      <span class="title logo">{{ title }}</span>
    </router-link>
    <div :class="`header_menu ${showMenu ? 'open' : ''}`">
      <v-menu :menu="menu" v-on:handleMenuClick="handleMenuClick" />
      <button
        @click="toggleShowMenu()"
        class="btn--icon menu-hamburguer"
      ></button>
      <!-- <identity /> -->
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService';
import BaseMenu from '@/components/BaseMenu';

export default {
  name: 'Header',
  components: {
    'v-menu': BaseMenu,
  },
  data() {
    return {
      showMenu: false,
      menu: [],
      logo: '',
      title: '',
    };
  },
  mounted: function() {
    contentService('header').then(response => {
      this.menu = response.data.menu;
      this.logo = response.data.logo;
      this.title = response.data.title;
    });
  },
  methods: {
    toggleShowMenu: function(value) {
      this.showMenu = !this.showMenu;
    },
    handleMenuClick: function(link) {
      if (this.showMenu) this.toggleShowMenu();
    },
  },
};
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
.header_menu .menu-hamburguer {
  display: none;
}

/* Media Mobile */
@media (max-width: 768px) {
  .header_menu .menu-hamburguer {
    display: block;
    z-index: 3;
    position: absolute;
    top: 14px;
    right: 20px;
    background-image: url('../assets/images/hamburguer.png');
  }
  .header_menu.open .menu {
    right: 0;
  }
  .header_menu.open .menu-hamburguer {
    background-image: url('../assets/images/close.png');
  }
}
</style>
