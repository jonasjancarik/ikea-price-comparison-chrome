// content-script.js

(async () => {
    const moduleUrls = {
        main: chrome.runtime.getURL('main.js'),
        ProductPage: chrome.runtime.getURL('pages/ProductPage.js'),
        CartPage: chrome.runtime.getURL('pages/CartPage.js'),
        Cart: chrome.runtime.getURL('models/Cart.js'),
        ProductItem: chrome.runtime.getURL('models/ProductItem.js'),
        ExchangeRates: chrome.runtime.getURL('utils/ExchangeRates.js'),
        DisplayUtils: chrome.runtime.getURL('utils/DisplayUtils.js'),
        DomUtils: chrome.runtime.getURL('utils/DomUtils.js'),
        PriceUtils: chrome.runtime.getURL('utils/PriceUtils.js'),
        ErrorUtils: chrome.runtime.getURL('utils/ErrorUtils.js'),
    };

    const main = await import(moduleUrls.main);
    main.default(moduleUrls);
})();