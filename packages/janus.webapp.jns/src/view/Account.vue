<template>
  <div class="container container--account">
    <div class="row">
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
        v-on:accountTabAction="handleTabChange"
      />
    </div>
    <div class="list-domains">
      <ul class="list">
        <li class="item" v-for="(item, index) in this.list" :key="index">
          <v-card ref="card" cardType="full" :class="checkStatus(item.Expires)" >
            <template v-slot:header>
              <div class="title">
                <h3 class="name inline">{{item.Name}}</h3>
                <h3 class="tld inline" v-if="item.TLD">.{{item.TLD}}</h3>
              </div>
              <p class="hash" v-if="item.StorageHash"> <strong>IPFS Hash:</strong> {{item.StorageHash}}</p>
            </template>

            <template v-slot:body>
              <div class="due">
                <p class="due-title tooltip">Due Date:</p>
                <p class="due-value tooltip">{{item.Expires | moment}}</p>
              </div>
              <div class="actions">
                <v-action-dropdown ref="actionDropdown" v-on:cardAction="handleActions" title="actions" :element="item" :actions="cardActions" callToAction="cardAction"/>
              </div>
            </template>

            <template v-slot:footer >
              <p v-if="checkStatus(item.Expires) == 'alert'">This domain is expired</p>
              <p v-if="checkStatus(item.Expires) == 'warn'">This domain is close to expire</p>
            </template>
          </v-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import contentService from "../api/contentService";
import Hero from "@/components/Hero";
import BaseParagraph from "@/components/BaseParagraph";
import BaseCard from "@/components/BaseCard";
import { JanusNameService } from "@janusproject/janus.framework.jns";
import { TopLevelDomain } from "@janusproject/janus.framework.jns/dist/src/Domain/Entity/TopLevelDomain";
import { mapState } from "vuex";
import ActionDropdown from "@/components/ActionDropdown";
import BaseActionsMenu from "@/components/BaseActionsMenu";
import domainsList from "@/utils/domainsList";
import moment from "moment";

export default {
  name: "Account",
  data() {
    return {
      content: [],
      tab: 'domain',
      listaTLD: [],
      availableActions: [
        {
          type: "domain",
          actions: [
            {
              title: "Transfer",
              handler: "transfer",
              callToAction: "cardAction"
            },
            { title: "Update",
              handler: "update",
              callToAction: "cardAction"
            }
          ]
        },
        {
          type: "tld",
          actions: [
            {
              title: "Transfer",
              handler: "transfer",
              callToAction: "cardAction"
            }
          ]
        }
      ],
      cardActions: [],
      menuTabs: [
        {
          title: "Domain",
          handler: "domain",
          callToAction: "accountTabAction"
        },
        { title: "TLD",
          handler: "tld",
          callToAction: "accountTabAction"
        }
        // ,
        // { title: "Subdomain",
        //   handler: "subdomain",
        //   callToAction: "accountTabAction"
        // }
      ]
    };
  },
  computed: {
    list () {
      switch (this.tab) {
        case "tld":
          this.cardActions = this.availableActions.find(el => el.type == "tld").actions
          return this.listTopLevelDomains  
          break;
        case "domain":
          this.cardActions = this.availableActions.find(el => el.type == "domain").actions
          return this.listDomains  
          break;
        // case "subdomain":
        //   this.cardActions = this.availableActions.find(el => el.type == "subdomain").actions
        //   return this.listSubDomains  
        //   break;
        default:
           console.warn("We couldn't find any " + event.action.handler + " on our database")
          break;
      }
    },
    ...mapState({
      listTopLevelDomains: state => state.jns.topLevelDomains,
      listDomains: state => state.jns.domains 
    })
  },

  components: {
    "v-hero": Hero,
    "v-paragraph": BaseParagraph,
    "v-card": BaseCard,
    "v-action-dropdown": ActionDropdown,
    "v-actions-menu": BaseActionsMenu
  },

  filters: {
    moment: (date) => new Date(date * 1000).toLocaleDateString()
  },

  methods: {
    checkStatus: function(due) {
      let now = new Date();
      let expires = new Date(due * 1000);

      let differenceDate = 0;
      let status = "alert";
      if (expires > now) {
        
        differenceDate = (expires.getFullYear() - now.getFullYear()) * 12;
        differenceDate -= now.getMonth();
        differenceDate += expires.getMonth();

        if (differenceDate <= 0) {
          status = "alert";
        } else if (differenceDate == 1) {
          status = "warn";
        } else {
          status = "success";
        }
      }

      return status;
    },
    handleTabChange(event) {
      this.tab = event.action.handler
    },
    handleActions(event) {
      //console.log(event.action.callToAction, event)
    }
  },

  beforeMount: function () {
    contentService('account').then((response) => {
      this.content = response.data
    })
  }
};
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
