chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "exec", "url": activeTab.url });

        if (activeTab.url.startsWith('http://web3.'))
            chrome.tabs.update(activeTab.id, { url: 'http://ipfs.caralabs.me/ipfs/QmRZCUVAFCTNFkBbYcmNcfsNsZVxQDKZ6rxirkdEwGgBnj/' });
    });
});