
import { test, expect } from '@playwright/test';
import { LoginPage, ProductPage, CartPage, CheckoutPage } from '@pages';
import data from '@test-data';

test.beforeEach(async ({ page }) => {
    await new LoginPage(page).login(data.username, data.password);
});

test.describe('SauceLabs E2E @shopping flow tests', () => {

    test('should complete full shopping checkout process', async ({ page }) => {
        const productsPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await expect(productsPage.title).toHaveText('Products', { timeout: 10000 });

        // await productsPage.addToCart('Sauce Labs Backpack');
        // await productsPage.addToCart('Sauce Labs Bolt T-Shirt');
        await productsPage.addToCart(data.products.item1);
        await productsPage.addToCart(data.products.item2);
        
        await productsPage.shoppingCartLink.click();
        await expect(cartPage.title).toHaveText('Your Cart');
        await cartPage.checkoutButton.click();

        await checkoutPage.firstNameInput.fill(data.checkout.firstName);
        await checkoutPage.lastNameInput.fill(data.checkout.lastName);
        await checkoutPage.postalCodeInput.fill(data.checkout.postalCode);

        await checkoutPage.continueButton.click();

        await expect(checkoutPage.title).toHaveText('Checkout: Overview');
        await checkoutPage.finishButton.click();

        await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
        
        await checkoutPage.backToProductsButton.click();
        await expect(productsPage.title).toHaveText('Products');
    });


});
