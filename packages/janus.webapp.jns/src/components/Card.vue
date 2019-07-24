<template>
  <div class="list-card">
    <h2 class="subtitle">{{list.title}}</h2>
    <ul class="list">
      <li class="item" :style="`width: ${width}%`" v-for="(item, index) in list.data" :key="index">
        <div class="item_icon" v-if="item.icon">
          <img class="icon" :src="item.icon">
          <!-- <img class="icon shadow" :src="item.icon"> -->
        </div>
        <div class="content">
          <div class="item_title" v-if="item.title">
            <h3 class="title" v-html="item.title || capitalize"></h3>
          </div>
          <div class="item_text" v-if="item.text">
            <p class="text" v-html="item.text"></p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Card',
  data () {
    return {
      width: 100/(this.list.data.length)
    }
  },
  filters: {
    capitalize: item => {
      return item.toUpperCase()
    }
  },
  props: {
    list: {
      type: Object
    }
  },
  components: {
  },
  mounted () {
  }
}
</script>
<style scoped>
.list {
  display: flex;
  width: 80%;
  margin: auto;
}

.subtitle {
  margin-bottom: 40px;
  font-size: 1.8em;
}

.item {
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 60px 40px 60px 60px;
  margin-bottom: 40px;
  background: #FFFFFF;
  border: 1px solid #DBDBDB;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  margin: 0 30px;
}

.item_icon {
  width: 6vw;
  height: 6vw;
  margin-right: 40px;
  position: relative;
}

.item_icon .shadow {
  position: absolute;
  top: 3px;
  left: 3px;
  opacity: .3;
  filter: blur(2px);
}

.item_icon .icon {
  width: 100%;
  height: auto;
}

.item_icon,
.content {
  display: inline-block;
}

.content {
  vertical-align: middle;
  width: 80%;
}

.item_title {
  margin-bottom: 10px;
  color: var(--color-navy);
}

.text {
  font-weight: 100;
}

/* Media Mobile */
@media (max-width: 768px) {
  .item {
    padding: 10%;
    display: block;
  }
  .item .content {
    width: fit-content;
  }
  .item_icon {
    width: 60px;
    height: auto;
    margin-bottom: 20px;
  }
}
@media (min-width: 1920px) {
  .list-icon .subtitle {
    font-size: 2vw;
  }
  .item .content {
    width: fit-content;
  }
  .item_title .title {
    font-size: 1.5vw;
  }
  .item_text .text {
    font-size: 1vw;
  }
}
</style>
