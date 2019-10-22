<template>
  <div class="list-cards">
    <h2 class="list-title">{{ list.title }}</h2>
    <ul class="list">
      <li
        :style="`width:${width}%`"
        v-for="(item, index) in list.data"
        :key="index"
        class="item"
      >
        <v-card ref="card" :cardType="cardStyle">
          <template v-slot:header>
            <img v-if="item.icon" :src="item.icon" class="item_icon" />
            <h3 v-html="item.title || capitalize" class="title"></h3>
          </template>

          <template v-slot:body>
            <p v-html="item.text" class="text"></p>
          </template>
        </v-card>
      </li>
    </ul>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard';

export default {
  name: 'CardListBlock',
  filters: {
    capitalize: item => {
      return item.toUpperCase();
    },
  },
  components: {
    'v-card': BaseCard,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
    cardStyle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      width: 100 / this.list.data.length - 2,
    };
  },
  mounted() {},
};
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
