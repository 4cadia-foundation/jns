console.log('---------- content running');

chrome.runtime.onMessage.addListener(function(request, sender) {
  window.history.pushState('', '', '/' + request);
});
