<template>
  <ul class="menu">
    <li class="menu-hamburguer">
      <button class="btn--icon" @click='toggleShowMenu()'></button>
    </li>
    <li class="menu-item actions" v-for="(link, index) in this.menu" :key="index">
      <router-link v-if="link.path" :to="link.path">{{link.title}}</router-link>
      <a target="_blank" v-else-if="link.href" :href="link.href">{{link.title}}</a>
      <div class="submenu dropdown" v-else-if="link.submenu">
        <a class="dropdown-toggle" href="#" role="button" aria-haspopup="true" aria-expanded="false">{{link.title}}</a>
        <ul class="dropdown-menu shadow">
          <li class="dropdown-item" v-for="(link, index) in link.submenu" :key="index">
            <router-link v-if="link.path" :to="link.path">{{link.title}}</router-link>
            <a target="_blank" v-else-if="link.href" :href="link.href">{{link.title}}</a>
          </li>
        </ul>
      </div>
      <span v-else>{{link.title}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BaseMenu',
  components: {
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
    console.log(this.menu)
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
.dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  z-index: 5;
  left: -50%;
  right: -50%;
  margin: auto;
  display: none;
  text-align: center;
  min-width: 140px;
}
.dropdown:hover .dropdown-menu {
  display: block;
}
.dropdown-item {
  border-bottom: 1px solid var(--color-gray-lighter);
  display: block;
}
.dropdown-item:last-of-type {
  border-bottom: none;
}
.dropdown-item a {
  width: 100%;
  display: block;
  height: 100%;
  padding: 15px 10px;
  box-sizing: border-box;
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
