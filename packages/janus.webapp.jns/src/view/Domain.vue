<template>
  <div class="container container--domain">
    <div class="row" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="full-content">
      </v-hero>
      <v-card v-if="block['type']=='list_card'" :list="block['content'][0]"/>
    </div>
    
    <div>
      
      <v-modal ref="domainModal">
        <template v-slot:header>
          <h3> Modal </h3>
        </template>

        <template v-slot:body>
          <p>To sign in Janus it is necessary create a decentralized identity.</p>
        </template>

        <template v-slot:footer>
          <button class="btn btn--success">Teste</button>
        </template>
      </v-modal>

    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseParagraph from '@/components/BaseParagraph'
import BaseCard from '@/components/BaseCard'
import BaseModal from '@/components/BaseModal'

export default {
  name: 'Domain',
  data () {
    return {
      content: [],
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard,
    'v-modal': BaseModal
  },
  mounted: function () {
    contentService('domain').then((response) => {
      this.content = response.data
    })
    this.$refs.domainModal.openModal()
  }
}
</script>

<style scoped>
</style>
