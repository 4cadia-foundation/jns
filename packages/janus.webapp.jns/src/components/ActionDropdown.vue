<template>
  <div class="submenu dropdown">
    <button class="dropdown-toggle btn btn--outline">{{ title }}</button>
    <v-actions-menu
      :actions="actions"
      :element="element"
      :listClasses="`dropdown-menu shadow`"
    />
  </div>
</template>

<script>
import BaseDropdown from '@/components/BaseDropdown'
import BaseActionsMenu from '@/components/BaseActionsMenu'
export default {
  name: 'BaseDropdown',
  extends: BaseDropdown,
  components: {
    'v-actions-menu': BaseActionsMenu
  },
  data () {
    return {
    }
  },
  methods: {
  },
  props: {
    title: {
      type: String
    },
    element: {
      type: Object
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