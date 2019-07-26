<template>
  <div class="container container--account">
    <div class="col" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="colapsed">
      </v-hero>
      <v-cards-list v-if="block['type']=='list_card'" :list="block['content'][0]" cardStyle="list" />
    </div>
    <div class="list-domains">
      <ul class="list">
        <li class="item" v-for="(list, index) in this.list" :key="index">
          <v-card ref="card" cardType="full" :class="list.status">
            <template v-slot:title>
              <h3 class="title">{{list.title}}</h3>
            </template>

            <template v-slot:body>
              <div class="due">
                <span>Due Date: </span>
                <span>
                  {{list.due | moment}}
                </span>
              </div>
            </template>

            <template v-slot:body>
              <div class="due">
                <span>Due Date: </span>
                <span>
                  {{list.due | moment}}
                </span> 
              </div>
            </template>

            <template v-slot:footer>
              <div class="actions">
                <v-actions-menu />
              </div>
            </template>
          </v-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseParagraph from '@/components/BaseParagraph'
import BaseCard from '@/components/BaseCard'
import ActionsMenu from '@/components/ActionsMenu'
import moment from 'moment'

export default {
  name: 'Account',
  data () {
    return {
      content: [],
      list: [
        {
          title: "eth",
          status: "active",
          due: 1564172616000
        },
        {
          title: "janus.eth",
          status: "expired",
          due: 1560630216000
        },
        {
          title: "4CADI4.eth",
          status: "warn",
          due: 1560630216000
        }
      ]
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard,
    'v-actions-menu': ActionsMenu
  },
  mounted: function () {
    contentService('account').then((response) => {
      this.content = response.data
    })
  },
  filters: {
    moment: function (date) {
      return moment(date).format("LL");
    }
  }
}
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  padding: 120px 50px 70px;
}
.item {
  margin: 10px 0;
}
</style>
