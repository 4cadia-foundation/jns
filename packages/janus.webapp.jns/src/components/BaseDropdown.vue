<template>
  <div class="submenu dropdown">
    <a class="dropdown-toggle" href="#" role="button" aria-haspopup="true" aria-expanded="false">{{ dropdown.title }}</a>
    <ul class="dropdown-menu shadow">
      <li class="dropdown-item" v-for="(link, index) in dropdown.sublinks" :key="index">
        <router-link v-if="link.path" :to="link.path">{{ link.title }}</router-link>
        <a target="_blank" v-else-if="link.href" :href="link.href">{{ link.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BaseDropdown',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  props: {
    dropdown: {
      type: Object
    }
  },
  mounted: function () {
  }
}
</script>

<style>
.dropdown {
  position: relative;
  width: auto;
  margin: auto;
  max-width: fit-content;
}
.dropdown:hover .btn--outline {
  color: white;
  background: var(--color-primary);
  transition: all ease-out .3s; 
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
  max-width: max-content;
}
.dropdown:hover .dropdown-menu {
  display: block;
}
.dropdown-menu li {
  border-bottom: 1px solid var(--color-gray-lighter);
  display: block;
}
.dropdown-menu li:last-of-type {
  border-bottom: none;
}
.dropdown a,
.dropdown-menu li a {
  color: var(--color-gray);
  text-decoration: none;
}
.dropdown-menu li a {
  width: 100%;
  display: block;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
}
.dropdown-menu li a:hover {
  color: var(--color-blue);
}
</style>