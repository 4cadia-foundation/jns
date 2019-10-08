import Vue from 'vue'
import Vuex from 'vuex'
import form from './modules/form'
import validation from './modules/validation'
import registerWeb3 from 'vuex-web3'
import registerSmartContract from './modules/smartcontract/index'
import profile from './modules/profile'
import authentication from './modules/authentication'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const vuexStore = new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    loggedIn (state, value) {
      state.loggedIn = value
    }
  },
  modules: {
    form,
    validation,
    profile,
    authentication
  },
  strict: debug
})

registerWeb3(vuexStore, 'w3')
registerSmartContract(vuexStore, 'jns')

export default vuexStore
