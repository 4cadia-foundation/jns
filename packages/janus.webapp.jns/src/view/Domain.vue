<template>
  <div class="container container--domain" ref="formContainer">
    <div class="row row--full">
      <v-hero v-if="content.list_hero" :hero="content.list_hero" float="right" classes="full-content">
        <v-form-domain ref="formDomain" v-on:handleSearchDomain="onSearchDomain"/>
      </v-hero>
    </div>
    <div class="row">
      <v-card ref="card" cardType="full" :class="checkStatus(data.isDomainAvaliable, data.isTldAvaliable)" v-if="data.domainValue && data.tldValue">
        <template v-slot:header>
          <div class="title">
            <h3 class="name inline">{{data.domainValue}}.{{data.tldValue}}</h3>
          </div>
          <div class="errors">
            <p>{{msg}}</p>
          </div>
        </template>

        <template v-slot:body>
          <div class="actions">
            <button v-if="checkStatus(data.isDomainAvaliable, data.isTldAvaliable) == 'success'" class="btn btn--success btn-confirm" @click="handleConfirmModal">Confirm transaction</button>
            <router-link v-else-if="checkStatus(data.isDomainAvaliable, data.isTldAvaliable) == 'warn'" class="btn btn--outline btn--link" to="/tld">Buy TLD</router-link>
          </div>
        </template>
      </v-card>
    </div>    
    <div class="modal-domain">
      <v-domain-modal ref="modalDomain" :tldValue="data.tldValue" :domainValue="data.domainValue"/>
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseParagraph from '@/components/BaseParagraph'
import BaseCard from '@/components/BaseCard'
import BuyDomainModal from '@/components/BuyDomainModal'
import FormDomain from '@/components/FormDomain'

export default {
  name: 'Domain',
  data () {
    return {
      content: [],
      data: {},
      status: '',
      msg: ''
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard,
    'v-domain-modal': BuyDomainModal,
    'v-form-domain': FormDomain
  },
  beforeMount: function () {
    contentService('domain').then((response) => {
      this.content = response.data
    })
  },
  methods: {
    onSearchDomain (data) {
      this.data = data
    },
    handleConfirmModal () {
      this.$refs.modalDomain.openModal()
    },
    checkStatus (domain, tld) {
      if (domain == true && tld == false) {
        this.status = 'success'
        this.msg = ''
        return this.status
      } else if (domain == true && tld == true) {
        this.status = 'warn'
        this.msg = 'This TLD has no owner. You need to buy this TLD first!'
        return this.status
      } else {
        this.status = 'alert'
        this.msg = 'This domain is not avaliable. Change the Domain or TLD name to purchase!'
        return this.status
      }
    }
  }
}
</script>

<style scoped>
.modal-domain .modal-header h3 {
  font-family: Montserrat;
  font-style: normal;
  color: var(--color-primary);
  display: flex;
  align-items: center;
}

.modal-domain h4 {
  text-align: left;
  margin: 5px 0px;
}

.modal-domain .modal-container {
  width: 600px;
  height: auto;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-bottom: 18.359px;
}

.img-check {
  margin-right: 9px;
} 

.modal-domain .modal-header .p {
  margin: 7px 0px;
}

.btn--success .btn-confirm {
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 130px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
}
</style>
