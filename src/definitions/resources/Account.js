import EThing from 'ething-js'

export default {

  created (account) {
    console.log(account, this)
    if (this.loginUrl) {
      window.location = EThing.toApiUrl(this.loginUrl + '?resource=' + account.id(), true);
    }
  },

  badges (account) {
    return {
      'logged': {
        component: 'q-chip',
        attributes () {
          return {
            label: account.attr('logged') ? 'logged' : 'not logged',
            outline: true,
            square: true,
            dense: true,
            color: account.attr('logged') ? "secondary" : 'negative',
          }
        },
      },
    }
  },

  actions (account) {
    if (this.loginUrl && !account.attr('logged')) {
      return {
        'login': {
          label: 'login',
          forceLabel: true,
          icon: 'mdi-login',
          click: () => {
            window.location = EThing.toApiUrl(this.loginUrl + '?resource=' + account.id(), true);
          }
        }
      }
    }
  }

}
