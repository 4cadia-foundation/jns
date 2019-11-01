<template>
  <ul :class="`menu-actions ${listClasses}`">
    <li v-for="(action, index) in actions" :key="index" class="menu-item">
      <button
        v-on:click="handleClick(element, action)"
        :class="`btn btn--clear ${checkActiveTab(action.handler)}`"
      >
        {{ action.title }}
      </button>
    </li>
  </ul>
</template>

<script>
import BaseMenu from '@/components/BaseMenu';

export default {
  name: 'BaseActionsMenu',
  components: {},
  extends: BaseMenu,
  props: {
    actions: {
      type: Array,
      required: true,
    },
    element: {
      type: Object,
      default: () => ({}),
    },
    listClasses: {
      type: String,
      default: '',
    },
    activeTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  mounted: function() {},
  methods: {
    handleClick: function(element, action) {
      const emitValue = {};
      emitValue.action = action;
      emitValue.element = element;
      this.$emit(action.callToAction, emitValue);
    },
    checkActiveTab(tab) {
      return tab === this.activeTab ? 'active-tab' : '';
    },
  },
};
</script>

<style lang="css">
.menu-actions.tabs .menu-item .btn {
  padding: 10px 5px;
  border-bottom: 3px solid transparent;
}
.menu-actions.tabs .menu-item .active-tab {
  font-weight: 600;
  border-radius: 0;
  color: var(--color-primary);
  border-color: var(--color-primary);
  transition: .2s all linear;
}
</style>
