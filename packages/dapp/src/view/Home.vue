<template>
  <div class="container container--home">
    <div class="row row--full">
      <v-hero v-if="content.list_hero" :hero="content.list_hero" float="right" classes="full-content">
        <!-- <v-form-domain /> -->
        <router-link to="/domain" class="btn btn--link btn--hero">get your new domain</router-link>
      </v-hero>
    </div>

    <div class="row">
      <v-cards-list v-if="content.list_card" :list="content.list_card" cardStyle="square" />
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import CardListBlock from '@/components/CardListBlock'
// import FormDomain from '@/components/FormDomain'

export default {
  name: 'Home',
  data () {
    return {
      content: [],
      title: 'Janus Indexer'
    }
  },
  components: {
    'v-hero': Hero,
    'v-cards-list': CardListBlock
    // 'v-form-domain': FormDomain
  },
  methods: {
    getContentByType: function (type) {
      return this.content.find(el => el.type === type).content
    }
  },
  beforeMount: function () {
    contentService('home').then((response) => {
      this.content = response.data
    })
  },
  created: function () {
  }
}
</script>

<style scoped>
</style>
