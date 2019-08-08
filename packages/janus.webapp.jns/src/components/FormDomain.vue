<template>
  <div>
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
          inputLabel="TLD: "
          v-model="tld"
          :required="true"
          :alphaNumeric="true"
          ref="tldInput"
        />
      </div>
    </v-hero-form>
  </div>
</template>

<script>
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
  methods: {
    handleSearch: function (event) {

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
