import { IkeaPriceUtils } from '../utils/PriceUtils.js';
export class ProductItem {
    constructor(productName, id, localPrice, quantity = 1) {
        this.productName = '';
        this.id = '';
        this.localPricePerItem = 0;
        this.localPriceForQuantity = 0;
        this.quantity = 1;
        this.url = '';
        this.otherCountries = [];
        return (async () => {
            this.productName = productName;
            this.id = id;
            this.localPricePerItem = localPrice;
            this.quantity = quantity;
            this.localPriceForQuantity = localPrice * quantity;
            this.url = `https://www.ikea.com/cz/cs/p/-${this.id}`;
            await this.fetchAndCalculateOtherCountries();
            return this;
        })();
    }
    async fetchAndCalculateOtherCountries() {
        const { selectedCountries } = await chrome.storage.sync.get(['selectedCountries']);
        const otherCountryDetails = await IkeaPriceUtils.fetchForeignPrices(this.id);
        this.otherCountries = await Promise.all(otherCountryDetails
            .filter(details => selectedCountries ? selectedCountries.includes(details.country) : true)
            .map(async (details) => {
            const priceDiff = details.isAvailable
                ? await IkeaPriceUtils.calculatePriceDifference(this.localPricePerItem, details)
                : { convertedPrice: null, percentageDiff: null };
            const totalPrice = details.isAvailable && priceDiff.convertedPrice
                ? priceDiff.convertedPrice * this.quantity
                : null;
            return {
                ...details,
                priceDiff,
                totalPrice,
                pricePerItem: priceDiff.convertedPrice
            };
        }));
    }
    setQuantity(newQuantity) {
        if (newQuantity < 0 || !Number.isInteger(newQuantity)) {
            throw new Error('Quantity must be a non-negative integer');
        }
        this.quantity = newQuantity;
        this.localPriceForQuantity = this.localPricePerItem * this.quantity;
        this.updateOtherCountriesTotalPrices();
    }
    updateOtherCountriesTotalPrices() {
        this.otherCountries = this.otherCountries.map(country => ({
            ...country,
            totalPrice: country.isAvailable
                ? country.pricePerItem * this.quantity
                : null
        }));
    }
    getComparisonDataForQuantity() {
        return this.otherCountries.map(country => ({
            ...country,
            price: country.totalPrice !== null ? country.totalPrice : null
        }));
    }
}
