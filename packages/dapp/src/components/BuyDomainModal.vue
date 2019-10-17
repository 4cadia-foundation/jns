<template>
  <div class="action-modal">
    <v-modal ref="confirmBuyModal">
      <template v-slot:header>
        <h3>You're almost done</h3>
      </template>

      <template v-slot:body>
        <div class="modal-subtitle">
          <p>
            To finish the transaction, please check the informations above to
            ensure all itens are correct and confirm the transaction in Metamask
          </p>
        </div>
        <div class="modal-content">
          <div class="modal-row">
            <h4>Domain:</h4>
            <div class="row-wrapper">
              <img
                class="row-content row-content--icon"
                src="../assets/images/check.png"
                width="21px"
                height="21px"
              />
              <span class="row-content row-content--data">{{
                domainValue
              }}</span>
            </div>
          </div>
          <div class="modal-row">
            <h4>TLD:</h4>
            <div class="row-wrapper">
              <img
                class="row-content row-content--icon"
                src="../assets/images/check.png"
                width="21px"
                height="21px"
              />
              <span class="row-content row-content--data">{{ tldValue }}</span>
            </div>
          </div>
          <div class="modal-row">
            <h4>Insert your IPFS Hash:</h4>
            <v-input
              placeholderTxt="eg.: QmYbs8fHzYaXufL5gMyWB1XgnvbLRSqv9bb58LJHX3ziVv"
              inputType="text"
              inputName="IpfsHash"
              minlength="46"
              maxlength="46"
              v-model="IpfsHash"
              :required="true"
              :alphaNumeric="true"
              ref="IpfsHashInput"
            />
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <button class="btn btn--success btn-confirm" @click="handleConfirm">
          Confirm Transaction
        </button>
      </template>
    </v-modal>
  </div>
</template>

<script>
import BaseModal from '@/components/BaseModal'
import BaseInput from '@/components/BaseInput'

export default {
  name: 'BuyDomainModal',
  data () {
    return {
      IpfsHash: ''
    }
  },
  components: {
    'v-modal': BaseModal,
    'v-input': BaseInput
  },
  computed: {},
  props: {
    domainValue: {
      type: String
    },
    tldValue: {
      type: String
    }
  },
  methods: {
    openModal: function () {
      this.$refs.confirmBuyModal.openModal()
    },
    handleConfirm: function () {
      this.buyDomain(this.domainValue, this.tldValue, this.IpfsHash)
    },
    buyDomain (domain, tld, storageHash) {
      this.loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer
      })

      this.$store.getters
        .jnsInstance()
        .BuyDomain(domain, tld, storageHash)
        .then(newDomain => {
          if (
            newDomain.Success &&
            newDomain.Result[0].event === 'DomainRegistered'
          ) {
            this.$notification.success(
              'Success! Thank you for register a domain in Web3!'
            )
          }
          this.$emit('handleSearchTLD', {
            isAvaliable: false,
            tldSearchValue: tld
          })
          // console.log('BuyDomain', newDomain)
        })
        .catch(err => {
          this.$notification.error(err.message)
          console.error('BuyDomain', err)
        })
        .finally(() => {
          this.$refs.confirmBuyModal.closeModal()
          this.loader.hide()
        })
    }
  },
  mounted: function () {}
}
</script>

<style>
.action-modal .modal-container {
  width: 50vw;
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
