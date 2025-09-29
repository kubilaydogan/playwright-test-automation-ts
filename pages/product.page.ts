
import { Page, Locator } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    readonly title: Locator;
    readonly openMenuButton: Locator;
    readonly logoutButton: Locator;
    readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    }

    /**
     * Adds a product to cart using the product name
     * @param productName - The name of the product to add to cart (e.g., 'Sauce Labs Backpack')
     */
    async addToCart(productName: string): Promise<void> {
        const addToCartButton = this.page.locator(`xpath=//div[.="${productName}"]/../../following-sibling::div/button`);
        await addToCartButton.waitFor({ state: 'visible', timeout: 3000 });
        await addToCartButton.click();
    }
}
