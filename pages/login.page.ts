
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly title: Locator;
    readonly openMenuButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.locator('[data-test="username"]');
        this.passwordField = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');

        this.errorMessage = page.locator('[data-test="error"]');
        this.title = page.locator('[data-test="title"]');
        this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
    }

    async login(username: string, password: string): Promise<void> {
        await this.page.goto('/');
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    async logout(): Promise<void> {
        await this.openMenuButton.click();
        await this.logoutButton.click();
    }

}
