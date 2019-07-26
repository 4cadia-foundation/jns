import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Domain from '@/view/Domain'
import TopLevel from '@/view/TopLevel'
import Account from '@/view/Account'
import NotFound from '@/view/NotFound'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/tld',
      name: 'TopLevel',
      component: TopLevel
    },
    {
      path: '/domain',
      name: 'Domain',
      component: Domain
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/404',
      name: 'Not Found',
      component: NotFound
    },
    { path: '/documentation', redirect: '/' },
    { path: '*', redirect: '/404' }
  ]
})
