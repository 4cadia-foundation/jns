<template>
  <div class="paragraph">
    <h2 v-if="paragraph.title" v-html="paragraph.title" class="subtitle"></h2>
    <div class="content">
      <div v-if="paragraph.text" v-html="paragraph.text" class="text"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseParagraph',
  props: {
    paragraph: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>
<style>
.paragraph {
  position: relative;
  width: 80%;
  margin: auto;
  align-items: center;
  text-align: left;
}
.text {
  /* text-align: left; */
}
@media (min-width: 1920px) {
  .paragraph .subtitle {
    font-size: 2vw;
  }
  .text {
    font-size: 1.2vw;
  }
}
</style>
