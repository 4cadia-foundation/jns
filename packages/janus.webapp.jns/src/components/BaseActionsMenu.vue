<template>
  <ul :class="`menu menu-actions ${listClasses}`">
    <li class="menu-item" v-for="(action, index) in this.actions" :key="index">
      <button v-on:click="handleClick(element, action)" class="btn btn--clear">{{action.title}}</button>
    </li>
  </ul>
</template>

<script>
import BaseMenu from '@/components/BaseMenu'

export default {
  name: 'BaseActionsMenu',
  extends: BaseMenu,
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick: function (element, action) {
      const emitValue = {}
      emitValue.action = action
      emitValue.element = element
      this.$emit(action.callToAction, emitValue )
    }
  },
  props: {
    actions: {
      type: Array
    },
    element: {
      type: Object
    },
    listClasses: {
      type: String
    }
  },
  mounted: function () {
  }
}
</script>

<style lang="css">
</style>
