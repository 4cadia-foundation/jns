import { JanusNameService } from '@4cadia/jns-core'

export default {
  resolveJanusNameService ({ dispatch, commit, rootState }) {
    Promise.resolve(dispatch('initWeb3')).then(() => {
      dispatch('newJanusNameService', rootState.w3)
    })
  },
  newJanusNameService ({ commit, dispatch }, storeinstance) {
    (async () => {
      console.log('Initialize Janus Name Service')
      const w3Provider = storeinstance.instance().givenProvider
      const jns = new JanusNameService(w3Provider)
      commit('setInstanceJNS', () => jns)
      dispatch('setListTopLevelDomain', await jns.ListTLD())
      dispatch('setListDomain', await jns.ListDomain())
    })()
  },
  setListTopLevelDomain: ({ commit }, list) =>
    commit('setTopLevelDomainList', list.Result),
  setListDomain: ({ commit }, list) => commit('setDomainList', list.Result)
}
