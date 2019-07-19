import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
// import Domain from '@/view/Domain'
// import TopLevel from '@/view/TopLevel'
import About from '@/view/About'
import Profile from '@/view/Profile'
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
      path: '/about',
      name: 'About',
      component: About
    },
    // {
    //   path: '/tld',
    //   name: 'TopLevel',
    //   component: TopLevel
    // },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
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
