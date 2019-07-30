<template>
  <div class="submenu dropdown">
    <button class="dropdown-toggle btn btn--outline">{{ title }}</button>
    <ul class="dropdown-menu shadow">
      <li class="dropdown-item" v-for="(action, index) in actions" :key="index">
        <button v-on:click="handleClick(id, action)" class="btn btn--clear">{{action.title}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import BaseDropdown from '@/components/BaseDropdown'
export default {
  name: 'BaseDropdown',
  extends: BaseDropdown,
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick: function (id, action) {
      this.$root.$emit('ClickAction', [id, action.title] )
    }
  },
  props: {
    title: {
      type: String
    },
    id: {
      type: Number
    },
    actions: {
      type: Array
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