<template>
  <div class="container container--domain">
    <div class="row" v-for="(block, index) in this.content" :key="index">
      <v-hero v-if="block['type']=='list_hero'" :hero="block['content'][0]" float="right" classes="full-content">
      </v-hero>
      <v-card v-if="block['type']=='list_card'" :list="block['content'][0]"/>
    </div>
    
    <div class="modal-domain">
      
      <v-modal ref="domainModal">
        <template v-slot:header class="modal-header">
          <h3> You are almost done </h3>
          
        </template>

        <template v-slot:body>
          <p class="modal-body">To finish the transaction, please check the informations above to ensure all itens are completed.</p>
          <h4>Will be added to your due date:</h4>
          <p><img src="../assets/images/check.png" width="21px" height="21px" class="img-check">365</p>
          <h4>Your new due date is:</h4>
          <p><img src="../assets/images/check.png" width="21px" height="21px" class="img-check">15.06.2020</p>
        </template>

        <template v-slot:footer>
          <button class="btn btn--success btn-lua">Confirm transaction</button>
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

<style>

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

.btn--success .btn-lua {
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
