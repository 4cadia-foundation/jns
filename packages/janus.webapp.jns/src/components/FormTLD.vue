<template>
  <div>
    <v-hero-form class="form--tld" :action="this.action" v-on:searchTLD="handleSearch">
      <div class="field_wrapper field--tld">
        <v-input
          placeholderTxt="eg.: eth"
          inputType="text"
          inputName="tld"
          inputLabel="TLD Name: "
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
  name: 'FormTLD',
  components: {
    'v-input': BaseInput,
    'v-hero-form': FormHero
  },
  data () {
    return {
      tld: '',
      isAvaliable: null,
      action: {
        title: 'Search',
        handler: 'searchTLD'
      }
    }
  },
  computed: {
  },
  methods: {
    handleSearch: function (event) {
      this.loader = this.$loading.show({
        container: this.fullPage ? null : this.$refs.formContainer
      })

      this.$store.getters.jnsInstance().IsTldRegistered(this.tld)
        .then(response => {
          if(response.Success && response.Result[0]){
            this.isAvaliable = !response.Result[0].IsTldRegistered
            this.$emit('handleSearchTLD', { "isAvaliable": this.isAvaliable, 'tldSearchValue': this.tld })
          }
        })
        .catch(error => this.$notification.error(error))
        .finally(() => this.loader.hide())
    }
  },
  mounted () {
  }
}
</script>

<style>
.form--tld .field_wrapper.field--tld {
  padding-left: 30px;
}
.form--tld .field_wrapper.field--tld::before {
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
