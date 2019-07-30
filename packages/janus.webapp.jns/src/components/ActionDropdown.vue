<template>
  <div class="submenu dropdown">
    <button class="dropdown-toggle btn btn--outline">{{ title }}</button>
    <ul class="dropdown-menu shadow">
      <li class="dropdown-item">
        <button v-on:click="handleClick" class="btn btn--clear" :data-id="id">Transfer</button>
      </li>
      <li class="dropdown-item">
        <button v-on:click="handleClick" class="btn btn--clear" :data-id="id">Update</button>
      </li>
      <li class="dropdown-item">
        <button v-on:click="handleClick" class="btn btn--clear" :data-id="id">Renew</button>
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
    handleClick: function (event) {
      console.log(event)
    }
  },
  props: {
    title: {
      type: String
    },
    id: {
      type: Number
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>
.btn--clear {
  padding: 20px 30px;
}
</style>