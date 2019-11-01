export default function onEthereumChanged(methodName) {
  const boundMethod = Symbol('bound-method');

  return {
    created() {
      if (window.ethereum) {
        this[boundMethod] = this[methodName].bind(this);

        window.ethereum.on('accountsChanged', this[boundMethod]);
        window.ethereum.on('networkChanged', this[boundMethod]);
      }
    },
    destroyed() {
      if (window.ethereum && this[boundMethod]) {
        window.ethereum.off('accountsChanged', this[boundMethod]);
        window.ethereum.off('networkChanged', this[boundMethod]);
      }
    },
  };
}
