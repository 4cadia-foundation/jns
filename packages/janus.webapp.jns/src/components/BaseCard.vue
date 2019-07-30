<template>
  <div :class="`card shadow ${this.cardType}`">
    <div v-if="this.$slots.header" class="card_content card_header">
      <slot name="header"></slot>
    </div>
    <div v-if="this.$slots.title" class="card_content card_title">
      <slot name="title"></slot>
    </div>
    <div v-if="this.$slots.body" class="card_content card_body">
      <slot name="body"></slot>
    </div>
    <div v-if="this.$slots.footer" class="card_content card_footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  data () {
    return {
    }
  },
  filters: {
    capitalize: item => {
      return item.toUpperCase()
    }
  },
  props: {
    cardType: {
      type: String
    }
  },
  components: {
  },
  mounted () {
  }
}
</script>

<style>
.card {
  padding: 40px 30px;
  text-align: center;
  height: 100%;
  position: relative;
  /* overflow: hidden; */
}
.card.full {
  display: flex;
  justify-content: space-between;
  padding: 30px 60px;
  border-radius: 8px;
  border-left-width: 10px;
}
.card.full .card_content {
  margin: auto 0;
  height: auto;
}
.card.full .card_title .title {
  margin: auto 0;
}
.card.full.success {
  border-left-color: var(--color-green);
}
.card.full.alert {
  border-left-color: var(--color-red);
}
.card.full.warn {
  border-left-color: var(--color-yellow);
}
</style>
