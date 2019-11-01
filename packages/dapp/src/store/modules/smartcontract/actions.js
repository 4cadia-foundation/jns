import { JanusNameService } from '@4cadia/jns-core';

export default {
  async resolveJanusNameService({ dispatch, commit, rootState }) {
    await dispatch('initWeb3');
    dispatch('newJanusNameService', rootState.w3);
  },
  async newJanusNameService({ commit, dispatch }, storeinstance) {
    const w3Provider = storeinstance.instance().givenProvider;
    commit('setInstanceJNS', () => new JanusNameService(w3Provider));

    await dispatch('loadAll');
  },
  async loadAll({ dispatch }) {
    await dispatch('loadTldList');
    await dispatch('loadDomainList');
  },
  async loadTldList({ commit, rootState }) {
    const jns = rootState.jns.instance();

    try {
      const tldListResponse = await jns.ListTLD();
      commit('setTopLevelDomainList', tldListResponse.Result);
    } catch (err) {
      console.error(err);
      commit('setTopLevelDomainList', []);
    }
  },
  async loadDomainList({ commit, rootState }) {
    const jns = rootState.jns.instance();

    try {
      const domainListResponse = await jns.ListDomain();
      commit('setDomainList', domainListResponse.Result);
    } catch (err) {
      console.error(err);
      commit('setDomainList', []);
    }
  },
};
