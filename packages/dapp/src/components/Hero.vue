<template>
  <div :class="`hero float--${float} ${classes}`">
    <div class="hero_content">
      <div class="content content--text">
        <h1 v-if="hero.title" v-html="hero.title" class="title"></h1>
        <div v-if="hero.text" v-html="hero.text" class="text subtitle"></div>
      </div>
      <div v-if="hero.image" class="content content--image">
        <img :src="hero.image" alt="" />
      </div>
      <div class="content content--slot">
        <slot></slot>
      </div>
    </div>
    <img
      class="hero_background"
      src="../../static/images/hero.png"
      alt="background color"
    />
  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: {
    hero: {
      type: Object,
      required: true,
    },
    float: {
      type: String,
      default: 'left',
    },
    classes: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
}

.hero.colapsed {
  min-height: auto;
  transition: all linear 0.1s;
}

.hero.colapsed .hero_background {
  background-size: cover;
}

.hero.colapsed .subtitle {
  display: none;
}

.hero .hero_background {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* background-image: url('/static/images/hero.png'); */
  /* background-size: 100% 100%; */
  /* background-repeat: no-repeat; */
  filter: brightness(70%);
  z-index: -1;
}

.hero_content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin: auto;
  position: relative;
  z-index: 1;
}

.hero.colapsed .hero_content {
  padding: 30px 0;
}

.hero .content--text {
  color: white;
  text-align: left;
}

.hero .content--text .title {
  color: white;
  margin-top: 0;
}

.hero .content--text .text {
  color: var(--color-white);
}

.hero .content--image,
.hero .content--text {
  vertical-align: middle;
}

.hero .content--image {
  width: 40vw;
  max-width: 800px;
}

.hero .content--image img {
  width: 100%;
}

.hero.full-content .hero_content,
.hero.colapsed .hero_content {
  flex-direction: column;
}

.hero.colapsed .hero_content {
  text-align: left;
  align-items: flex-start;
}

.hero.full-content .content--text {
  width: 80%;
  margin: auto;
  text-align: center;
}

.hero .content--slot {
  width: 100%;
  margin: auto;
  text-align: center;
}

@media (max-width: 768px) {
  .hero {
    max-height: 100%;
    height: auto;
  }
  .hero .hero_background {
    -webkit-transform: skew(0deg, -3deg) translateY(-20px);
    transform: skew(0deg, -3deg) translateY(-20px);
  }
  .hero_content {
    padding: 40px 0 80px;
    display: block;
  }
  .hero.full-content .content--text {
    width: 90%;
    min-width: 304px;
  }
  .hero .content--image {
    margin: auto;
    width: 80%;
  }
}
@media (min-width: 1920px) {
  .hero .content--text .title {
    font-size: 2vw;
  }
  .hero .content--text {
    font-size: 1.2vw;
  }
  .hero_content {
    padding: 6vw 0;
  }
}
</style>
