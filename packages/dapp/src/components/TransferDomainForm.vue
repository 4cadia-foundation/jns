<template>
  <form @submit.prevent="handleSubmit">
    <h4>Domain:</h4>
    <div class="row-wrapper">
      <img
        class="row-content row-content--icon"
        src="../assets/images/check.png"
        width="21px"
        height="21px"
      />
      <span class="row-content row-content--data">{{ domain }}.{{ tld }}</span>
    </div>
    <div class="row-wrapper">
      <div class="field_wrapper field--tld">
        <v-input
          ref="newOwnerInput"
          v-model="newOwnerAddress"
          :required="true"
          :alphaNumeric="true"
          placeholder-txt="eg.: 0x0000000000000000000000000000000000000000"
          input-type="text"
          input-name="newOwnerAddress"
          input-label="New owner address: "
          label-class=""
          maxlength="42"
          minlength="42"
        />
      </div>
    </div>
    <button
      :class="[
        'btn',
        'btn-confirm',
        isValid ? 'btn--success' : 'btn--disabled',
      ]"
      :disabled="!isValid"
      type="submit"
    >
      Confirm Transaction
    </button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseInput from '@/components/BaseInput';

export default {
  name: 'TransferTLDForm',
  components: {
    'v-input': BaseInput,
  },
  props: {
    tld: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    newOwnerAddress: '',
    isMounted: false,
  }),
  computed: {
    ...mapGetters('validation', ['getErrorByType', 'getExceptionByType']),
    isValid() {
      if (!this.isMounted) {
        return false;
      }

      return !this.$refs.newOwnerInput.hasExceptions;
    },
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    handleSubmit() {
      this.$refs.newOwnerInput.handleValidate();

      if (this.isValid) {
        this.transferDomain(this.domain, this.tld, this.newOwnerAddress);
      }
    },
    async transferDomain(domain, tld, newOwnerAddress) {
      try {
        const response = await this.$store.getters
          .jnsInstance()
          .TransferDomain(domain, tld, newOwnerAddress);

        if (
          response.Success &&
          response.Result[0].event === 'DomainOwnershipChanged'
        ) {
          this.$notification.success(
            `Successfully transfered domain ${domain}.${tld} to user ${newOwnerAddress}`
          );

          this.$emit('domain-transfer-succeeded', {
            domain,
            tld,
            newOwnerAddress,
          });
        }
      } catch (err) {
        this.$notification.error(err.message);

        this.$emit('domain-transfer-failed', {
          domain,
          tld,
          newOwnerAddress,
        });
      } finally {
        this.$emit('domain-transfer-finished', {
          domain,
          tld,
          newOwnerAddress,
        });
      }
    },
  },
};
</script>

<style>
.row-wrapper {
  margin: 10px 0;
}
</style>
