<template>
  <div class="container container--account">
    <div class="row row--full">
      <v-hero
        v-if="content.list_hero"
        :hero="content.list_hero"
        float="right"
        classes="colapsed"
      ></v-hero>
    </div>
    <div class="tab-menu">
      <v-actions-menu
        :actions="menuTabs"
        listClasses="tabs"
        :activeTab="activeTab"
        v-on:accountTabAction="handleTabChange"
      />
    </div>
    <div class="list-domains">
      <ul class="list">
        <div v-if="!list[0] && activeTab == 'domain'">
          <h3>You don't have any domain. Try buying one first!</h3>
          <router-link to="/domain" class="btn btn--link btn--hero"
            >get your new domain</router-link
          >
        </div>

        <div v-if="!list[0] && activeTab == 'tld'">
          <h3>You don't have any Top Level Domain. Try buying one first!</h3>
          <router-link to="/tld" class="btn btn--link btn--hero"
            >get your new TLD</router-link
          >
        </div>

        <li class="item" v-for="(item, index) in this.list" :key="index">
          <v-card ref="card" cardType="full" :class="checkStatus(item.Expires)">
            <template v-slot:header>
              <div class="title">
                <h3 class="name inline">{{ item.Name }}</h3>
                <h3 class="tld inline" v-if="item.TLD">.{{ item.TLD }}</h3>
              </div>
              <p class="hash" v-if="item.StorageHash">
                <strong>IPFS Hash:</strong> {{ item.StorageHash }}
              </p>
            </template>

            <template v-slot:body>
              <div class="due">
                <p class="due-title tooltip">Due Date:</p>
                <p class="due-value tooltip">{{ item.Expires | moment }}</p>
              </div>
              <div class="actions">
                <v-action-dropdown
                  ref="actionDropdown"
                  v-on:cardAction="handleActions"
                  title="actions"
                  :element="item"
                  :actions="cardActions"
                  callToAction="cardAction"
                />
              </div>
            </template>

            <template v-slot:footer>
              <p v-if="checkStatus(item.Expires) == 'alert'">
                This domain is expired
              </p>
              <p v-if="checkStatus(item.Expires) == 'warn'">
                This domain is close to expire
              </p>
            </template>
          </v-card>
        </li>
      </ul>
    </div>
    <div class="modal-tld">
      <v-renew-tld-modal
        ref="modalRenewTLD"
        :tld="selectedTld.name"
        @tld-renew-succeeded="loadAll"
      />
      <v-tld-transfer-modal
        ref="modalTransferTLD"
        v-on:TLDTransfered="onTLDTransfered"
        :tld="selectedTld.name"
      />
    </div>
  </div>
</template>

<script>
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseCard from '@/components/BaseCard'
import { mapState } from 'vuex'
import ActionDropdown from '@/components/ActionDropdown'
import BaseActionsMenu from '@/components/BaseActionsMenu'
import RenewTLDModal from '@/components/RenewTLDModal'
import TransferTLDModal from '@/components/TransferTLDModal'

export default {
  name: 'Account',
  data () {
    return {
      content: [],
      activeTab: 'domain',
      listaTLD: [],
      availableActions: [
        {
          type: 'domain',
          actions: [
            {
              title: 'Renew',
              handler: 'renew',
              callToAction: 'cardAction'
            },
            {
              title: 'Transfer',
              handler: 'transferDomain',
              callToAction: 'cardAction'
            },
            {
              title: 'Update',
              handler: 'updateDomain',
              callToAction: 'cardAction'
            }
          ]
        },
        {
          type: 'tld',
          actions: [
            {
              title: 'Renew',
              handler: 'handleRenewTLD',
              callToAction: 'cardAction'
            },
            {
              title: 'Transfer',
              handler: 'transferTLD',
              callToAction: 'cardAction'
            }
          ]
        }
      ],
      cardActions: [],
      menuTabs: [
        {
          title: 'Domain',
          handler: 'domain',
          callToAction: 'accountTabAction'
        },
        {
          title: 'TLD',
          handler: 'tld',
          callToAction: 'accountTabAction'
        }
        // ,
        // { title: "Subdomain",
        //   handler: "subdomain",
        //   callToAction: "accountTabAction"
        // }
      ],
      selectedTld: {}
    }
  },
  computed: {
    list () {
      switch (this.activeTab) {
        case 'tld':
          // TODO: refactor this
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.cardActions = this.availableActions.find(
            el => el.type === 'tld'
          ).actions
          return this.listTopLevelDomains
        case 'domain':
          // TODO: refactor this
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.cardActions = this.availableActions.find(
            el => el.type === 'domain'
          ).actions
          return this.listDomains
        // case "subdomain":
        //   this.cardActions = this.availableActions.find(el => el.type == "subdomain").actions
        //   return this.listSubDomains
        //   break;
        default:
          console.warn(
            "We couldn't find any " + event.action.handler + ' on our database'
          )
          return undefined
      }
    },
    ...mapState({
      listTopLevelDomains: state => state.jns.topLevelDomains,
      listDomains: state => state.jns.domains
    })
  },
  components: {
    'v-hero': Hero,
    'v-card': BaseCard,
    'v-action-dropdown': ActionDropdown,
    'v-actions-menu': BaseActionsMenu,
    'v-renew-tld-modal': RenewTLDModal,
    'v-tld-transfer-modal': TransferTLDModal
  },

  filters: {
    moment: date => new Date(date * 1000).toLocaleDateString()
  },

  methods: {
    loadAll () {
      this.$store.dispatch('loadAll')
    },
    checkStatus: function (due) {
      const now = new Date()
      const expires = new Date(due * 1000)

      let differenceDate = 0

      let status = 'alert'

      if (expires > now) {
        differenceDate = differenceInCalendarDays(expires, now)

        if (differenceDate <= 0) {
          status = 'alert'
        } else if (differenceDate > 0 && differenceDate <= 30) {
          status = 'warn'
        } else {
          status = 'success'
        }
      }

      return status
    },
    handleTabChange (event) {
      this.activeTab = event.action.handler
    },
    handleActions (event) {
      const { action, element } = event
      console.log(action.handler)
      this[action.handler](element)
    },
    handleRenewTLD ({ Name, Expires }) {
      this.selectedTld = { name: Name, expires: Expires }
      this.$refs.modalRenewTLD.openModal()
      const { action, element } = event
      this[action.handler](element)
    },
    transferTLD ({ Name, Expires }) {
      this.selectedTld = { name: Name, expires: Expires }
      this.$refs.modalTransferTLD.openModal()
    },
    onTLDTransfered () {
      return this.list()
    }
  },
  beforeMount: function () {
    contentService('account').then(response => {
      this.content = response.data
    })

    this.$store.dispatch('resolveJanusNameService')
  }
}
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  margin: 10px 50px 140px;
}
.item {
  margin: 10px 0;
}
.item .hash {
  margin: 10px 0 0 0;
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
.tab-menu {
  margin: 20px 50px 0;
  text-align: left;
  border-bottom: 2px solid var(--color-gray-lighter);
}
</style>
