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
          <v-card ref="card" cardType="full" :class="checkStatus(list.due)">
            <template v-slot:title>
              <h3 class="title">{{list.title}}</h3>
            </template>

            <template v-slot:body>
              <div class="due">
                <p class="due-title tooltip">Due Date: </p>
                <p class="due-value tooltip">
                  {{list.due | moment}}
                </p>
              </div>
              <div class="actions">
                <v-action-dropdown title="actions" :id="list.id"/>
              </div>
            </template>

            <template v-slot:footer>
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
import ActionDropdown from '@/components/ActionDropdown'
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
          due: 1598746311000,
          id: 1
        },
        {
          title: "janus.eth",
          status: "expired",
          due: 1560630216000,
          id: 2
        },
        {
          title: "4CADI4.eth",
          status: "warn",
          due: 1569802311000,
          id: 3
        }
      ]
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard,
    'v-action-dropdown': ActionDropdown
  },
  mounted: function () {
    contentService('account').then((response) => {
      this.content = response.data
    })
  },
  filters: {
    moment: function (date) {
      return moment(date).toDate().toLocaleDateString()
    }
  },
  methods: {
    checkStatus: function (due) {
      let now = Date.now()
      let differenceDate = moment(due).diff(moment(now), 'months')
      let status = 'success'
      if (differenceDate < 0) {
        status = 'alert'
      } else if (differenceDate <= 2) {
        status = 'warn'
      } 
      return status
    }
  }
}
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  margin: 50px 50px 140px;
}
.item {
  margin: 10px 0;
}
.due,
.actions {
  display: inline-block;
  vertical-align: middle;
}
.due {
  margin-right: 30px; 
  text-align: left;
}
.due .tooltip {
  margin: 5px 0;
}
</style>
