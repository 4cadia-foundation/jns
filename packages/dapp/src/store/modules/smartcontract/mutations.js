export default {
  setInstanceJNS (state, payload) {
    state.instance = payload
  },
  setTopLevelDomainList (state, payload) {
    state.topLevelDomains = payload
  },
  setDomainList (state, payload) {
    state.domains = payload
  }
}
