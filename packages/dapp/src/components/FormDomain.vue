<template>
  <v-hero-form class="form--domain" :action="action" v-on:searchDomain="handleSearch">
    <div class="field_wrapper field--domain">
      <v-input
        placeholderTxt="eg.: janus"
        inputType="text"
        inputName="domain"
        inputLabel="Domain Name: "
        v-model="domain"
        :required="true"
        :alphaNumeric="true"
        ref="domainInput"
      />
    </div>
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
  name: 'FormDomain',
  components: {
    'v-input': BaseInput,
    'v-hero-form': FormHero
  },
  data () {
    return {
      domain: '',
      tld: '',
      isDomainAvaliable: true,
      isTldAvaliable: true,
      action: {
        title: 'Search',
        handler: 'searchDomain'
      },
      loader: {}
    }
  },
  computed: {
    ...mapGetters('validation', [
      'getErrorByType'
    ])
  },
  methods: {
    handleSearch: function (event) {
      if (this.isSearchAvaliable()) {
         
        this.loader = this.$loading.show({
          container: this.fullPage ? null : this.$refs.formContainer
        })

        this.$store.getters.jnsInstance().IsTldRegistered(this.tld)
          .then(response => {
            if(response.Success && response.Result[0]){
              this.isTldAvaliable = !response.Result[0].IsTldRegistered
              this.$store.getters.jnsInstance().IsDomainRegistered(this.domain, this.tld)
                .then(response => {
                  if(response.Success && response.Result[0]){
                    this.isDomainAvaliable = !response.Result[0].isDomainRegistered
                    this.$emit('handleSearchDomain', {
                      'isTldAvaliable': this.isTldAvaliable,
                      'isDomainAvaliable': this.isDomainAvaliable,
                      'domainValue': this.domain,
                      'tldValue': this.tld
                    })
                  }
                })
                .catch(error => this.$notification.error(error))
                .finally(() => this.loader.hide())
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
      // TODO: Validate JNS errors on initiate Janus Service
      if (this.$store.getters.jnsInstance()._jnsService != undefined) {
        return true
      } else {
        this.$notification.error(this.getErrorByType('BadRequest'))
        return false
      }
    },
    isEmptyField () {
      if (this.tld.length == 0) this.$refs.tldInput.fieldIsValid(true, 'EmptyField')
      if (this.domain.length == 0) this.$refs.domainInput.fieldIsValid(true, 'EmptyField')
    },
    formHasExceptions () {
      return this.$refs.domainInput.hasExceptions || this.$refs.tldInput.hasExceptions
    }
  }
}
</script>

<style>
.form--hero.form--domain .form_content--body {
  display: flex;
}
.form--domain .field_wrapper {
  display: inline-block;
  position: relative;
}
.form--domain .field_wrapper.field--domain {
  flex-grow: 1;
}
.form--domain .field_wrapper.field--tld {
  padding-left: 30px;
  max-width: 40%;
}
.form--domain .field_wrapper.field--tld::before {
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
