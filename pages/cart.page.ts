import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }
}
