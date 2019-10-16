<template>
  <form @submit.prevent="handleSubmit" ref="transferForm">
    <h4>TLD:</h4>
    <div class="row-wrapper">
      <img
        class="row-content row-content--icon"
        src="../assets/images/check.png"
        width="21px"
        height="21px"
      />
      <span class="row-content row-content--data">{{ tld }}</span>
    </div>
    <div class="row-wrapper">
      <div class="field_wrapper field--tld">
        <v-input
          ref="newOwnerInput"
          placeholderTxt="eg.: 0x0000000000000000000000000000000000000000"
          inputType="text"
          inputName="tld"
          inputLabel="New owner address: "
          labelClass=""
          v-model="newOwnerAddress"
          :required="true"
          :alphaNumeric="true"
          maxlength="42"
          minlength="42"
        />
      </div>
    </div>
    <button
      type="submit"
      :class="[
        'btn',
        'btn-confirm',
        isValid ? 'btn--success' : 'btn--disabled',
      ]"
      :disabled="!isValid"
    >
      Confirm Transaction
    </button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseInput from '@/components/BaseInput'

export default {
  name: 'TransferTLDForm',
  components: {
    'v-input': BaseInput
  },
  props: {
    tld: String
  },
  data: () => ({
    newOwnerAddress: '',
    isMounted: false
  }),
  mounted () {
    this.isMounted = true
  },
  computed: {
    ...mapGetters('validation', ['getErrorByType', 'getExceptionByType']),
    isValid () {
      if (!this.isMounted) {
        return false
      }

      return !this.$refs.newOwnerInput.hasExceptions
    }
  },
  methods: {
    handleSubmit: function () {
      this.$refs.newOwnerInput.handleValidate()

      if (this.isValid) {
        this.transferTLD(this.tld, this.newOwnerAddress)
      }
    },
    async transferTLD (tld, newOwnerAddress) {
      const loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer
      })

      try {
        const response = await this.$store.getters
          .jnsInstance()
          .TransferTLD(tld, newOwnerAddress)

        if (
          response.Success &&
          response.Result[0].event === 'TopDomainOwnershipChanged'
        ) {
          this.$notification.success(
            `Successfully transfered the TLD ${tld} to ${newOwnerAddress}`
          )
        }

        this.$emit('tldTransfered', {
          tld,
          newOwnerAddress
        })
      } catch (err) {
        this.$notification.error(err.message)
        this.$emit('tldTransferFailed', {
          tld,
          newOwnerAddress
        })
      } finally {
        loader.hide()
        this.$emit('tldTransferFinished', {
          tld,
          newOwnerAddress
        })
      }
    }
  }
}
</script>

<style>
.row-wrapper {
  margin: 10px 0;
}
</style>
