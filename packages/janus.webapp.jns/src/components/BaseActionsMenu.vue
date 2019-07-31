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
  components: {
  },
  data () {
    return {
      value: 'I am the child.'
    }
  },
  methods: {
    // handleClick: function (element, action) {
    //   const emitValue = {}
    //   emitValue.action = action
    //   emitValue.element = element
    //   this.$emit('ClickAction' + action.title, emitValue )
    // }
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
    },
    method: { type: Function }
  },
  mounted: function () {
    // Instead of calling the method we emit an event
    this.$emit('send-message', this.value)
  }
}
</script>

<style lang="css">
</style>
