import { test, expect } from '@playwright/test';
import { LoginPage, ProductPage } from '@pages';
import data from '@test-data';


test.describe('SauceLabs @login tests', () => {

    test('should login with valid credentials @positive', async ({ page }) => {
        await new LoginPage(page).login(data.username, data.password);
        const productsPage = new ProductPage(page);
        await expect(productsPage.title).toHaveText('Products', { timeout: 10000 });
    });

    test('should handle invalid credentials gracefully @negative', async ({ page }) => {
        const loginPage = new LoginPage(page)
        await loginPage.login(data.username, 'invalid_password');

        await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');

        // await page.waitForTimeout(3000);    // for demo purposes
    });

});