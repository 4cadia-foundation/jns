<template>
  <div :class="`hero float--${float} ${classes}`" >
    <div class="hero_content">
      <div class="content content--text">
        <h1 class="title" v-if="hero.title" v-html="hero.title"></h1>
        <div class="text subtitle" v-if="hero.text" v-html="hero.text"></div>
        <slot></slot>
      </div>
      <div class="content content--image" v-if="hero.image">
        <img :src="hero.image" alt="">
      </div>
    </div>
    <div class="hero_background"></div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  data () {
    return {
    }
  },
  props: {
    hero: {
      type: Object
    },
    float: {
      type: String
    },
    classes: {
      type: String
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  min-height: 50vw;
}

.hero.colapsed {
  max-height: 15vw;
  min-height: auto;
}

.hero .hero_background {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('../assets/images/hero.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.hero.colapsed .hero_background {
  background-size: cover;
}

.hero_content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 90%;
  margin: auto;
  padding: 8% 0;
  position: relative;
  z-index: 1;
}

.hero.colapsed .hero_content {
  padding: 30px 0;
}

.hero .content--text {
  color: white;
  text-align: left;
  width: 50%;
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

.hero.full-content .content--text {
  width: 80%;
  margin: auto;
  text-align: center;
}

@media (max-width: 768px) {
  .hero {
    max-height: 100%;
    height: auto;
    margin-bottom: 40px;
  }
  .hero .hero_background {
    -webkit-transform: skew(0deg, -3deg) translateY(-20px);
    transform: skew(0deg, -3deg) translateY(-20px);
  }
  .hero_content {
    padding: 40px 0 80px;
    display: block;
  }
  .hero .content--text {
    width: 90%;
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
