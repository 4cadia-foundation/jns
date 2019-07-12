<template>
  <div class="container container--home">
    <div class="col" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="full-content">
        <v-list-actions/>
      </v-hero>
      <v-card v-if="block['type']=='list_card'" :list="block['content'][0]"/>
    </div>
  </div>
</template>

<script>
import contentService from '../api/contentService'
import Hero from '@/components/Hero'
import ListIcon from '@/components/ListIcon'
import ListActions from '@/components/ListActions'
import Paragraph from '@/components/Paragraph'
import Card from '@/components/Card'

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
    'v-list-icon': ListIcon,
    'v-list-actions': ListActions,
    'v-paragraph': Paragraph,
    'v-card': Card
  },
  mounted: function () {
    contentService('home').then((response) => {
      this.content = response.data
    })
  }
}
</script>

<style scoped>
.paragraph {
  position: relative;
  width: 80%;
  margin: auto;
  align-items: center;
  padding: 0 0 40px 0;
  text-align: center;
}
@media (min-width: 1920px) {
  .paragraph .subtitle {
    font-size: 2vw;
  }
}
</style>
