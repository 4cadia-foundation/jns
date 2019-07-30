<template>
  <ul class="menu">
    <li class="menu-hamburguer">
      <button class="btn--icon" @click='toggleShowMenu()'></button>
    </li>
    <li class="menu-item actions" v-for="(link, index) in this.menu" :key="index">
      <router-link v-if="link.path" :to="link.path">{{link.title}}</router-link>
      <a target="_blank" v-else-if="link.href" :href="link.href">{{link.title}}</a>
      <v-dropdown-menu v-else-if="link.sublinks" :dropdown="link"/>
      <span v-else>{{link.title}}</span>
    </li>
  </ul>
</template>

<script>
import BaseDropdown from '@/components/BaseDropdown'

export default {
  name: 'BaseMenu',
  components: {
    'v-dropdown-menu': BaseDropdown
  },
  data () {
    return {
    }
  },
  methods: {
  },
  props: {
    menu: {
      type: Array
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
.menu {
  position: relative;
  text-align: right;
  align-items: center;
  display: inline-block;
  margin: auto;
  height: auto;
  vertical-align: middle;
}
.menu-item {
  display: inline-block;
  padding: 0 10px;
}
.menu-item a {
  text-decoration: none;
  color: var(--color-gray);
}
.menu-item a:hover {
  color: var(--color-blue);
}
.menu-hamburguer {
  display: none;
}

/* Media Mobile */
@media (max-width: 768px) {
  .menu {
    position: fixed;
    width: 70vw;
    height: 100%;
    z-index: 2;
    background: white;
    top: 0;
    right: -70vw;
    padding: 60px 0;
    display: block;
    transition: all linear .3s;
  }
  .menu-item {
    margin-right: 10px;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    display: block;
  }
  .menu-hamburguer {
    display: block;
  }
  .header_menu.open .menu {
    right: 0;
  }
  .menu-hamburguer {
    z-index: 3;
    position: absolute;
    top: 14px;
    right: 20px;
    background-image: url('../assets/images/hamburguer.png');
  }
  .header_menu.open .menu-hamburguer {
    background-image: url('../assets/images/close.png');
  }
}
</style>
