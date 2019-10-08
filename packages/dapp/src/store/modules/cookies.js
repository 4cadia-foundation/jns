import Cookie from 'js-cookie'
import index from '../index'

export function updateFromCookies () {
  const loggedIn = Cookie.get('logged_in')
  if (loggedIn && JSON.parse(loggedIn)) {
    index.commit('loggedIn', true)
  } else {
    index.commit('loggedIn', false)
  }
}
