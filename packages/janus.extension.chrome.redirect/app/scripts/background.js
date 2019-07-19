import SmartContract from './core/SmartContract';

(async() => {
    console.log('---------- backgound running');


    const jnsContract = new SmartContract();
    const contract = jnsContract.contract();

    chrome.webNavigation.onBeforeNavigate.addListener((details) => {

        chrome.tabs.query({ 'active': true, 'currentWindow': true }, async(tabs) => {

            let activeTab = tabs[0];

            if (activeTab && activeTab.url) {

                if (activeTab.url.startsWith('http://jns.') ||
                    activeTab.url.startsWith('https://www.google.com/search') && activeTab.url.includes('?q=jns.')) {

                    console.log('----------' + activeTab.url);

                    const result = await contract.getStorageHashByDomain('janus', 'eth');

                    console.log(result);

                    console.log('---------- true');
                    chrome.tabs.update(activeTab.id, { url: 'http://ipfs.caralabs.me/ipfs/QmRZCUVAFCTNFkBbYcmNcfsNsZVxQDKZ6rxirkdEwGgBnj/' });
                }
            }
        });
    });
})();