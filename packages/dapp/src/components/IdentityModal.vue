<template>
  <div>
    <base-modal ref="modal">
      <template v-slot:header>
        <h3>Sign In</h3>
      </template>

      <template v-slot:body>
        <p>To sign in Janus it is necessary create a decentralized identity.</p>
      </template>

      <template v-slot:footer>
        <button
          @click="handleCivic"
          v-bind:class="{ 'button-disabled': disableCivic }"
          class="modal-button civic logo-civic"
        >
          Civic
        </button>
        <button
          @click="handleMetaMask"
          v-bind:class="{ 'button-disabled': disableMetaMask }"
          class="modal-button metamask logo-metamask"
        >
          MetaMask
        </button>
        <button
          @click="handleuPort"
          v-bind:class="{ 'button-disabled': disableuPort }"
          class="modal-button uPort logo-uPort"
        >
          uPort
        </button>
        <div v-if="showError" class="modal-error-message">
          <p>Could not log in, try again later.</p>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<script>
import BaseModal from '@/components/BaseModal';
import axios from 'axios';
import { mapState } from 'vuex';
import Web3 from 'web3';
import { ethers } from 'ethers';

export default {
  name: 'IdentityModal',
  components: {
    'base-modal': BaseModal,
  },
  data() {
    return {
      showError: false,
      disableCivic: process.env.DISABLE_IDENTITY_CIVIC,
      disableMetaMask: process.env.DISABLE_IDENTITY_METAMASK,
      disableuPort: process.env.DISABLE_IDENTITY_UPORT,
    };
  },
  computed: {
    ...mapState({
      userID: state => state.profile.userID,
      data: state => state.profile.data,
      activeAccount: state => state.web3.account,
    }),
  },
  mounted: function() {},
  methods: {
    handleMetaMask: async function() {
      let signer;
      let provider;
      let web3;
      try {
        // eslint-disable-next-line
        web3 = new Web3(ethereum)
        // Solicita acesso a carteira Ethereum se necessário
        // eslint-disable-next-line
        let accounts = await ethereum.enable()
        if (typeof web3 !== 'undefined') {
          // Use Mist/MetaMask's provider
          this.$store.dispatch('web3/registerWeb3');
          provider = new ethers.providers.Web3Provider(web3.currentProvider);
          let originalCookie = [];
          signer = provider.getSigner();
          signer.getAddress().then(addr => {
            console.log(' handleMetaMask addr ', addr, ' signer ', signer);
            originalCookie = addr;
            provider.getNetwork().then(network => {
              console.log(' handleMetaMask network...', network);
              // console.log('err', process)
              axios
                .post(process.env.IDENTITY_BASE_URL, { token: originalCookie })
                .then(
                  response => {
                    // console.log(response.data)
                    this.$store.commit('profile/setResponse', response.data);
                    document.cookie = 'janusToken=' + originalCookie;
                    this.closeModal();
                    this.$router.push({ name: 'Home' });
                  },
                  err => {
                    console.log(err.response);
                    console.log(err);
                    console.error('handleMetaMask erro vindo do backend ', err);
                    this.showError = true;
                  }
                );
            });
          });
        }
      } catch (err) {
        console.error('handleMetaMask error ', err);
        alert(
          'You need to have MetaMask installed or grant this page to access your account.'
        );
      }
      // console.log(originalCookie)
    },
    handleuPort: function() {
      console.log('clicou');
    },
    handleCivic: function() {
      /* global Civic */
      /* eslint no-undef: "error" */
      console.log(process.env.CIVICID);
      const civicSip = new Civic({ appId: `${process.env.CIVICID}` });
      civicSip.signup({
        style: 'popup',
        scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP,
      });
      civicSip.on('auth-code-received', event => {
        if (event.response) {
          // console.log(event.response)
          this.isLoading = true;
          const originalCookie = event.response;
          axios
            .post(process.env.IDENTITY_BASE_URL, { token: event.response })
            .then(
              response => {
                console.log(response.data);
                this.$store.commit('profile/setResponse', response.data);
                document.cookie = 'janusToken=' + originalCookie;
                this.closeModal();
                this.isLoading = false;
                this.$router.push({ name: 'Home' });
              },
              () => {
                this.showError = true;
              }
            );
        }
      });
    },
    openModal: function() {
      this.$refs.modal.openModal();
    },
  },
};
</script>

<style scoped>
/* logo Civic */
.modal-button.civic {
  background: url('../assets/images/civic.svg') no-repeat 15px center, #3ab03e;
  background-size: 23px;
}

/* logo MetaMask */
.modal-button.metamask {
  background: url('../assets/images/metamask-logo.svg') no-repeat 15px center,
    #f79220;
  background-size: 23px;
}

/* logo uPort */
.modal-button.uPort {
  background: url('../assets/images/uport-logo.png') no-repeat 15px center,
    #5c50ca;
  background-size: 23px;
}
</style>
