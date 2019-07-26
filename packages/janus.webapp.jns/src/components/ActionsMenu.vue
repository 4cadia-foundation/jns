<template>
  <ul class="menu menu--actions">
    <li class="menu-item actions">
      <div class="submenu dropdown">
        <button class="dropdown-toggle btn btn--outline"> Actions </button>
        <ul class="dropdown-menu shadow">
          <li class="dropdown-item">
            <a target="_blank" href="">Renew</a>
          </li>
          <li class="dropdown-item">
            <a target="_blank" href="">Transfer</a>
          </li>
          <li class="dropdown-item">
            <a target="_blank" href="">Update</a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ActionsMenu',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted: function () {
    console.log(this.menu)
  }
}
</script>

<style lang="css">
</style>
