<template>
  <div class="submenu dropdown">
    <button class="dropdown-toggle btn btn--outline">{{ title }}</button>
    <v-actions-menu
      ref="actions"
      :actions="actions"
      :element="element"
      :listClasses="`dropdown-menu shadow`"
    />
  </div>
</template>

<script>
import BaseDropdown from '@/components/BaseDropdown';
import BaseActionsMenu from '@/components/BaseActionsMenu';
export default {
  name: 'ActionDropdown',
  components: {
    'v-actions-menu': BaseActionsMenu,
  },
  extends: BaseDropdown,
  props: {
    title: {
      required: true,
      type: String,
    },
    element: {
      required: true,
      type: Object,
    },
    actions: {
      required: true,
      type: Array,
    },
    callToAction: {
      required: true,
      type: String,
    },
  },
  data() {
    return {};
  },
  mounted: function() {
    this.$refs.actions.$on(this.callToAction, data => {
      this.handleEmit(data);
    });
  },
  methods: {
    handleEmit: function(data) {
      this.$emit(this.callToAction, data);
    },
  },
};
</script>

<style>
.dropdown .btn--clear {
  padding: 10px 0;
}
</style>
