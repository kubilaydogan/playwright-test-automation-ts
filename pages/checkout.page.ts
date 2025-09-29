
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly title: Locator;
    
    // Checkout form
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    
    // Checkout completion
    readonly finishButton: Locator;
    readonly completeHeader: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        
        // Checkout form
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        
        // Checkout completion
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    }
}
