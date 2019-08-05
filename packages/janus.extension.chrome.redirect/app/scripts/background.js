import SmartContract from './core/SmartContract';

(async() => {

    console.log('-----background runing');

    const jnsContract = new SmartContract();
    const contract = jnsContract.contract();
    const notFoundHash = 'QmNoBEYtzFmUEoHQrQvmwsSg8fRMh3M1xzHb17LMw5tQwv';
    const storagePrefix = 'http://ipfs.caralabs.me/ipfs/';

    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
        chrome.tabs.query({ 'active': true, 'currentWindow': true }, async(tabs) => {

            try {
                let activeTab = tabs[0];
                let web3Url = '';

                if (activeTab && activeTab.url) {
                    let domain;
                    let topDomain;

                    if (activeTab.url.startsWith('http://w3.') ||
                        activeTab.url.startsWith('http://web3.') ||
                        activeTab.url.startsWith('http://jns.')) {

                        console.log('starts jns');

                        const splitedUrl = activeTab.url.split('.');

                        domain = splitedUrl[1];
                        topDomain = splitedUrl[2];

                        domain = domain.replace('/', '');
                        topDomain = topDomain.replace('/', '');

                        web3Url = domain + '.' + topDomain;

                    } else if (activeTab.url.startsWith('https://www.google.com/search') &&
                        activeTab.url.includes('?q=w3.') || activeTab.url.includes('?q=web3.') ||
                        activeTab.url.includes('?q=jns.')) {

                        console.log('google redirect');

                        const params = activeTab.url.split('?');
                        const param = params[1].split('&');
                        const qparam = param[0].split('=');
                        const domains = qparam[1].split('.');

                        domain = domains[1];
                        topDomain = domains[2];

                        domain = domain.replace('/', '');
                        topDomain = topDomain.replace('/', '');

                        web3Url = domain + '.' + topDomain;
                    }

                    if (topDomain && domain) {
                        let result;

                        result = await contract.getStorageHashByDomain(domain, topDomain);
                        console.log('result: ' + result);

                        if (result) {
                            chrome.tabs.update(activeTab.id, { url: storagePrefix + result + '/' });
                        } else {
                            chrome.tabs.update(activeTab.id, { url: storagePrefix + notFoundHash + '/' });
                        }

                        if (web3Url) {
                            console.log('send message');

                            setTimeout(function() {
                                chrome.tabs.sendMessage(tabs[0].id, web3Url);
                            }, 2000);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
    });
})();