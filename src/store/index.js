import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  // ログイン・ログアウトに用いる認証情報
  auth: {
    token: null,
    userId: null
  },
  // ボードが持つタスクリスト
  board: {
    lists: []
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: process.env.NODE_ENV !== 'production'
})
