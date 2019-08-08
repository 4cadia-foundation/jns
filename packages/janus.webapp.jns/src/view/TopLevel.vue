<template>
  <div class="container container--tld" ref="formContainer">
    <div class="row row--full">
      <v-hero v-if="content.list_hero" :hero="content.list_hero" float="right" classes="full-content">
        <v-form-tld ref="formTld" v-on:handleSearchTLD="onSearchTLD"/>
      </v-hero>
    </div>
    <div class="row">
      <v-card ref="card" cardType="full" :class="status ? 'success' : 'alert'" v-if="searchValue">
        <template v-slot:header>
          <div class="title">
            <h3 class="name inline">{{searchValue}}</h3>
          </div>
          <div class="errors">
            <p v-if="!status">This TLD already has an owner. Do you want to buy a Domain instead?</p>
          </div>
        </template>

        <template v-slot:body>
          <div class="actions">
            <button v-if="status" class="btn btn--success btn-confirm" @click="handleBuy">Buy This TLD</button>
            <router-link class="btn btn--outline btn--link" v-else to="/domain">Buy domain</router-link>
          </div>
        </template>
      </v-card>
    </div>
    <div class="modal-tld">
      <v-tld-modal ref="modalTLD" v-on:handleSearchTLD="onSearchTLD" :tldValue="searchValue"/>
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseParagraph from '@/components/BaseParagraph'
import BaseCard from '@/components/BaseCard'
import FormTLD from '@/components/FormTLD'
import BuyTLDModal from '@/components/BuyTLDModal'

export default {
  name: 'TopLevel',
  data () {
    return {
      content: [],
      status: '',
      searchValue: ''
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard,
    'v-form-tld': FormTLD,
    'v-tld-modal': BuyTLDModal
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
      this.status = data.isAvaliable
      this.searchValue = data.tldSearchValue
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
