<template>
  <div class="identity">
    <identity-modal ref="identityModal"/>
    <button type="submit" :class="`identity-icon menu-toggle ${ isAuthenticated ? 'authenticated' : ''}`"></button>
    <div class="identity-menu dropdown-menu shadow">
      <div class="dropdown-content" v-if="isAuthenticated">
        <button class="dropdown-item" @click="handleProfile()"> Profile </button>
        <button class="dropdown-item" @click="handleSignOut()"> Sign Out </button>
      </div>
      <div class="dropdown-content" v-else>
        <button class="dropdown-item" @click="handleOpenModalAuth()"> Sign In </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IdentityModal from '@/components/IdentityModal'

export default {
  name: 'Identity',
  components: {
    'identity-modal': IdentityModal
  },
  computed: {
    ...mapState({
      activeAccount: state => state.web3.account,
      isAuthenticated: state => state.profile.authenticated
    })
  },
  data () {
    return {
      enableIdentity: process.env.IDENTITY,
      signIn: false
    }
  },
  methods: {
    handleProfile: function () {
      this.$router.push({ name: 'Profile' })
    },
    handleOpenModalAuth: function () {
      this.$refs.identityModal.openModal()
    },
    handleSignOut: function () {
      document.cookie = 'janusToken='
      this.$store.commit('profile/setAuthentication', false)
      this.$store.commit('profile/setResponse', [])
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
.identity {
  text-align: right;
  -webkit-align-items: center;
  display: inline-block;
  vertical-align: middle;
  align-items: center;
  position: relative;
}

.identity:hover .identity-menu {
  display: block;
  right: 0;
  left: initial;
}

.identity-icon {
  width: 40px;
  height: 40px;
  box-shadow: none;
  border: none;
  padding: 0;
  font-size: 0;
  background: url("../assets/images/account.png");
  filter: grayscale(100%);
  vertical-align: middle;
}

.dropdown-content button {
  width: 100%;
  color: black;
  padding: 12px 16px;
  border: none;
  display: block;
  cursor: pointer;
  font-family:'Montserrat', Helvetica, Arial, sans-serif;
  background-color: #ffffff;
  font-size: 1em;
}

.dropdown-content button:hover {
  color: var(--color-primary);
}

.dropdown:hover .dropdown-content {
  display: block;
}

/* Media Mobile */
@media (max-width: 768px) {
  .identity {
    display: block;
  }
  .dropdown-content {
    display: block;
    position: relative;
    width: 100%;
    box-shadow: none;
  }
}

/* Media Mobile */
@media (max-width: 768px) {
  .identity {
    display: block;
  }
}
</style>
