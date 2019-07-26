<template>
  <div :class="`card shadow ${this.cardType}`">
    <div class="card_header">
      <slot name="header"></slot>
    </div>
    <div class="card_title">
      <slot name="title"></slot>
    </div>
    <div class="card_body">
      <slot name="body"></slot>
    </div>
    <div class="card_footer">
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
}
</style>
