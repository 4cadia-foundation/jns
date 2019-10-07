import smartcontract from '../../../../smartcontract'
import { JanusNameService }  from "@janusproject/janus.framework.jns"


export default {
  resolveJanusNameService ({ dispatch, commit, rootState }) {
    Promise.resolve(dispatch('initWeb3'))
      .then(() => {
        dispatch('newJanusNameService', rootState.w3)
      })
  },
  newJanusNameService ({ commit, dispatch }, storeinstance) {
    new Promise(async (resolve, reject) => {
      console.log("Initialize Janus Name Service")
      const w3Provider = storeinstance.instance().givenProvider
      const jns = new JanusNameService(w3Provider, smartcontract.address)
      commit('setInstanceJNS', () => jns)
      dispatch('setListTopLevelDomain', await jns.ListTLD())
      dispatch('setListDomain', await jns.ListDomain())
      resolve(jns)
    })
  },
  setListTopLevelDomain: ({ commit }, list) =>  commit('setTopLevelDomainList', list.Result),
  setListDomain: ({ commit }, list) => commit('setDomainList', list.Result)  
}