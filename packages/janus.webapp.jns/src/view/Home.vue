<template>
  <div class="container container--home">
    <div class="col" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="full-content">
      </v-hero>
      <v-cards-list v-if="block['type']=='list_card'" :list="block['content'][0]" cardStyle="square" />
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseParagraph from '@/components/BaseParagraph'
import CardListBlock from '@/components/CardListBlock'

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
    'v-paragraph': BaseParagraph,
    'v-cards-list': CardListBlock
  },
  mounted: function () {
    contentService('home').then((response) => {
      this.content = response.data
    })
  }
}
</script>

<style scoped>
</style>
