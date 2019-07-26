<template>
  <div class="list-card">
    <h2 class="list-title">{{list.title}}</h2>
    <ul class="list">
      <li class="item shadow" v-for="(item, index) in list.data" :key="index">
        <div class="item_icon" v-if="item.icon">
          <img class="icon" :src="item.icon">
        </div>
        <div class="content">
          <div class="item_title" v-if="item.title">
            <h3 class="title" v-html="item.title || capitalize"></h3>
          </div>
          <div class="item_text" v-if="item.text">
            <div class="text" v-html="item.text"></div>
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
  margin: auto;
  justify-content: space-between;
}

.item {
  padding: 40px 30px;
  margin: 0 10px;
  text-align: center;
  width: 30%;
}

.item_icon {
  width: 6vw;
  height: 6vw;
  position: relative;
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
}

.item_title .title {
  margin: 20px 0;
  color: var(--color-navy);
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
  .item .content {
    width: fit-content;
  }
}
</style>
