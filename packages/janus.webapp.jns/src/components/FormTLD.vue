<template>
  <v-hero-form class="form--tld" :action="this.action" v-on:searchTLD="handleSearch">
    <div class="field_wrapper field--tld">
      <v-input
        placeholderTxt="eg.: eth"
        inputType="text"
        inputName="tld"
        inputLabel="Top Level Name: "
        maxlength="5"
        minlength="3"
        v-model="tld"
        :required="true"
        :alphaNumeric="true"
        ref="tldInput"
      />
    </div>
  </v-hero-form>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseInput from '@/components/BaseInput'
import FormHero from '@/components/FormHero'
export default {
  name: 'FormTLD',
  components: {
    'v-input': BaseInput,
    'v-hero-form': FormHero
  },
  data () {
    return {
      tld: '',
      isTldAvaliable: null,
      action: {
        title: 'Search',
        handler: 'searchTLD'
      }
    }
  },
  computed: {
    ...mapGetters('validation', [
      'getErrorByType',
      'getExceptionByType'
    ])
  },
  methods: {
    handleSearch: function (event) {
      
      if(this.isSearchAvaliable()) {

        this.loader = this.$loading.show({
          container: this.fullPage ? null : this.$refs.formContainer
        })

        this.$store.getters.jnsInstance().IsTldRegistered(this.tld)
          .then(response => {
            if(response.Success && response.Result[0]){
              this.isTldAvaliable = !response.Result[0].IsTldRegistered
              this.$emit('handleSearchTLD', { "isTldAvaliable": this.isTldAvaliable, 'tldValue': this.tld })
            }
          })
          .catch(error => this.$notification.error(error))
          .finally(() => this.loader.hide())
      }
    },
    isSearchAvaliable () {
      if (this.hasMetamask() && this.hasInstance()) {
        this.isEmptyField()
        return !this.formHasExceptions()
      }
    },
    hasMetamask () {
      if (this.$store.getters.address != null) {
        return true
      } else {
        this.$notification.error(this.getErrorByType('InstallMetamask'))
        return false
      }
    },
    hasInstance () {
      if (this.$store.getters.jnsInstance()._jnsService != undefined) {
        return true
      } else {
        // TODO: Validate JNS errors on initiate Janus Service
        this.$notification.error(this.getErrorByType('BadRequest'))
        return false
      }
    },
    isEmptyField () {
      if (this.tld.length == 0) this.$refs.tldInput.fieldIsValid(true, 'EmptyField')
    },
    formHasExceptions () {
      return this.$refs.tldInput.hasExceptions
    }
  },
  mounted () {
  }
}
</script>

<style>
.form--tld:not(.colapsed) .field_wrapper.field--tld {
  padding-left: 30px;
}
.form--tld:not(.colapsed) .field_wrapper.field--tld::before {
  content:"\A";
  width: 10px;
  height: 10px;
  border-radius:50%;
  background: var(--color-gray-lighter);
  display: block;
  position: absolute;
  top: 80px;
  left: 10px;
}
</style>
