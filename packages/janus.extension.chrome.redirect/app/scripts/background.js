import SmartContract from './core/SmartContract';

(async() => {
    console.log('---------- backgound running');

    const jnsContract = new SmartContract();
    const contract = jnsContract.contract();
    const notFoundHash = 'QmNoBEYtzFmUEoHQrQvmwsSg8fRMh3M1xzHb17LMw5tQwv';

    chrome.webNavigation.onBeforeNavigate.addListener((details) => {

        chrome.tabs.query({ 'active': true, 'currentWindow': true }, async(tabs) => {

            let activeTab = tabs[0];

            if (activeTab && activeTab.url) {

                console.log(activeTab.url);

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

                    console.log(domain);
                    console.log(topDomain);

                    let result;

                    try {
                        result = await contract.getStorageHashByDomain(domain, topDomain);
                        console.log('result: ' + result);
                    } catch (e) {
                        console.log(e);
                    }

                    if (result) {
                        executed = true;
                        chrome.tabs.update(activeTab.id, { url: 'http://ipfs.caralabs.me/ipfs/' + result + '/' });
                    } else {
                        chrome.tabs.update(activeTab.id, { url: 'http://ipfs.caralabs.me/ipfs/' + notFoundHash + '/' });
                    }

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

                    console.log(domain);
                    console.log(topDomain);

                    let result;

                    try {
                        result = await contract.getStorageHashByDomain(domain, topDomain);
                        console.log('result: ' + result);
                    } catch (e) {
                        console.log(e);
                    }

                    if (result) {
                        chrome.tabs.update(activeTab.id, { url: 'http://ipfs.caralabs.me/ipfs/' + result + '/' });
                    } else {
                        chrome.tabs.update(activeTab.id, { url: 'http://ipfs.caralabs.me/ipfs/' + notFoundHash + '/' });
                    }
                }
            }
        });
    });
})();