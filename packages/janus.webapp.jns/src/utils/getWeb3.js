import Web3 from 'web3'


let getWeb3 = new Promise((resolve, reject) => {
  let result = {}

  if (window.ethereum) {
    ethereum.enable()
      .then(() => {
        window.web3 = new Web3(window.ethereum)
        result = Object.assign({}, result, { web3 })

        web3.eth.net.getNetworkType()
          .then(network => {
            result = Object.assign({}, result, { network })

            web3.eth.getAccounts()
              .then(accounts => {
                web3.eth.defaultAccount = accounts[0]
                const account = web3.eth.defaultAccount
                result = Object.assign({}, result, { account })
                resolve(result)

              })
              .catch(console.error)
          })
          .catch(console.error)
      })
      .catch(err => console.error(`Access Denied -> ${err}`))
  }
  else if (window.web3) {
    console.log('Implements old web3 module')
  }
  else {
    console.error('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
})
export default getWeb3