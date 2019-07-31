<template>
  <div class="container container--account">
    <div class="row" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="colapsed">
      </v-hero>
      <v-cards-list v-else-if="block['type']=='list_card'" :list="block['content'][0]" cardStyle="list" />
    </div>
    
    <div class="list-domains">
      <v-actions-menu
        :actions="menuTabs"
        @send-message="handleSendMessage()"
      />
      <ul class="list">
        <li class="item" v-for="(item, index) in this.list" :key="index">
          <v-card ref="card" cardType="full" :class="checkStatus(item.due)">
            <template v-slot:title>
              <h3 class="title">{{item.title}}</h3>
            </template>

            <template v-slot:body>
              <div class="due">
                <p class="due-title tooltip">Due Date: </p>
                <p class="due-value tooltip">
                  {{item.due | moment}}
                </p>
              </div>
              <div class="actions">
                <v-action-dropdown title="actions" :element="item" :actions="actions"/>
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
import BaseActionsMenu from '@/components/BaseActionsMenu'
import domainsList from '@/utils/domainsList'
import moment from 'moment'

export default {
  name: 'Account',
  data () {
    return {
      content: [],
      list: [],
      actions: [
        {
          title: "Transfer"
        },
        { title: "Renew"},
        { title: "Update"}
      ],
      menuTabs: [
        { title: "Domain"},
        { title: "TLD"},
        { title: "Subdomain"}
      ]
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard,
    'v-action-dropdown': ActionDropdown,
    'v-actions-menu': BaseActionsMenu
  },
  mounted: function () {
    contentService('account').then((response) => {
      this.content = response.data
    })
    this.initDomainsList()
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
    },
    initDomainsList: function () {
      this.list = domainsList.domain
    },
    handleSendMessage(event, value) {
      // Our event handler gets the event, as well as any
      // arguments the child passes to the event
      console.log('From the child:', value);
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
