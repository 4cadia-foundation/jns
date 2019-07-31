<template>
  <div class="container container--tld">
    <div class="row" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="full-content">
      </v-hero>
      <v-card v-if="block['type']=='list_card'" :list="block['content'][0]"/>
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import BaseParagraph from '@/components/BaseParagraph'
import BaseCard from '@/components/BaseCard'

export default {
  name: 'TopLevel',
  data () {
    return {
      content: [],
    }
  },
  components: {
    'v-hero': Hero,
    'v-paragraph': BaseParagraph,
    'v-card': BaseCard
  },
  mounted: function () {
    contentService('tld').then((response) => {
      this.content = response.data
    })
  }
}
</script>

<style scoped>
</style>
