<template>
  <div class="action-modal">
    <v-modal ref="modal">
      <template v-slot:header>
        <h3>You're almost done </h3>
      </template>

      <template v-slot:body>
        <div class="modal-subtitle">
          <p>To finish the transaction, please check the informations above to ensure all itens are correct and confirm the transaction in Metamask</p>
        </div>
        <div class="modal-content">
          <div class="modal-row">
            <h4>Domain:</h4>
            <div class="row-wrapper">
              <img class="row-content row-content--icon" src="../assets/images/check.png" width="21px" height="21px">
              <span class="row-content row-content--data">{{domain}}.{{tld}}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn--success btn-confirm" @click="handleConfirm">Confirm Transaction</button>
      </template>
    </v-modal>
  </div>
</template>

<script>
import BaseModal from '@/components/BaseModal'

export default {
  name: 'RenewTLDModal',
  extends: BaseModal,
  components: {
    'v-modal': BaseModal
  },
  props: {
    tld: String,
    domain: String
  },
  methods: {
    openModal: function () {
      this.$refs.modal.openModal()
    },
    handleConfirm: function () {
      this.renewDomain(this.domain, this.tld)
    },
    renewDomain (domain, topLevelDomain) {
      const loader = this.loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer
      })
      this.$store.getters.jnsInstance().RenewDomain(domain, topLevelDomain)
        .then(response => {
          if (response.Success && response.Result[0].event === 'DomainRenewed') {
            this.$notification.success('Success! Domain renewed!')
            this.$emit('domain-renew-succeeded', { tld: topLevelDomain })
          }
        })
        .catch((err) => {
          this.$notification.error(err)
          console.error('renewDomain', err)
        })
        .finally(() => {
          this.$refs.modal.closeModal()
          loader.hide()
        })
    }
  }
}
</script>

<style>
.action-modal .modal-container {
  width: 40vw;
}
.action-modal .modal-content .modal-row {
  text-align: left;
}
.action-modal .modal-content .modal-row h4 {
  margin: auto;
}
.action-modal .modal-row .row-wrapper {
  margin: 10px 0;
}
.action-modal .modal-row .row-content {
  display: inline-block;
  vertical-align: middle;
}
</style>
