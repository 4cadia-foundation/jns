<template>
  <div class="list-cards">
    <h2 class="list-title">{{list.title}}</h2>
    <ul class="list">
      <li class="item" :style="`width:${width}%`" v-for="(item, index) in list.data" :key="index">
        <v-card ref="card" :cardType="cardStyle">
          <template v-slot:header>
            <img class="item_icon" v-if="item.icon" :src="item.icon">
            <h3 class="title" v-html="item.title || capitalize"></h3>
          </template>

          <template v-slot:body>
            <p class="text" v-html="item.text"></p>
          </template>
        </v-card>
      </li>
    </ul>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard'

export default {
  name: 'CardListBlock',
  data () {
    return {
      width: 100 / (this.list.data.length) - 2
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
    },
    cardStyle: {
      type: String
    }
  },
  components: {
    'v-card': BaseCard
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

.item_icon {
  width: 6vw;
  height: 6vw;
  position: relative;
}

@media (max-width: 768px) {
  .list {
    flex-direction: column;
  }

  .list .item {
    width: auto !important;
    margin-bottom: 10px;
  }
}
</style>
