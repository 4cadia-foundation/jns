<template>
  <div class="container container--tld">
    <div class="row row--full">
      <transition>
        <v-hero v-if="content.list_hero" :hero="content.list_hero" float="right" :classes="heroClass">
          <v-form-tld ref="formTld" :class="heroClass" v-on:handleSearchTLD="onSearchTLD"/>
        </v-hero>
      </transition>
    </div>
    <div class="row row--cards" v-if="data.tldValue">
      <v-card ref="cardTLD" cardType="full" :class="checkStatus(data.isTldAvaliable)">
        <template v-slot:header>
          <div class="title">
            <h3 class="name inline">{{data.tldValue}}</h3>
          </div>
          <div class="errors">
            <p>{{exceptionMessage}}</p>
          </div>
        </template>

        <template v-slot:body>
          <div class="actions">
            <button v-if="data.isTldAvaliable" class="btn btn--success btn-confirm" @click="handleBuy">Buy This TLD</button>
            <router-link v-else class="btn btn--outline btn--link" to="/domain">Buy domain</router-link>
          </div>
        </template>
      </v-card>
    </div>
    <div class="modal-tld">
      <v-tld-modal ref="modalTLD" v-on:handleSearchTLD="onSearchTLD" :tldValue="data.tldValue"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseCard from '@/components/BaseCard'
import FormTLD from '@/components/FormTLD'
import BuyTLDModal from '@/components/BuyTLDModal'

export default {
  name: 'TopLevel',
  data () {
    return {
      content: [],
      data: {},
      cardStatus: '',
      exceptionMessage: '',
      heroClass: 'full-content'
    }
  },
  components: {
    'v-hero': Hero,
    'v-card': BaseCard,
    'v-form-tld': FormTLD,
    'v-tld-modal': BuyTLDModal
  },
  computed: {
    ...mapGetters('validation', [
      'getErrorByType',
      'getExceptionByType'
    ])
  },
  beforeMount: function () {
    contentService('tld').then((response) => {
      this.content = response.data
    })
  },
  mounted () {
  },
  methods: {
    onSearchTLD (data) {
      this.data = data
      this.heroClass = 'colapsed'
    },
    checkStatus (isTldAvaliable) {
      if (isTldAvaliable) {
        this.cardStatus = 'success'
        this.exceptionMessage = ''
        return this.cardStatus
      } else {
        this.cardStatus = 'alert'
        this.exceptionMessage = this.getExceptionByType('OwnedTLD')
        return this.cardStatus
      }
    },
    handleBuy () {
      this.$refs.modalTLD.openModal()
    }
  }
}
</script>

<style>
.container--tld .card_content .errors p {
  margin: 10px 0 0;
}
</style>
