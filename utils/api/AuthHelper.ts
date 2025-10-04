import { APIRequestContext } from '@playwright/test';
import { AuthResponse } from '@types';

export class AuthHelper {
    constructor(private request: APIRequestContext) {}

    async getAuthToken(username: string = 'admin', password: string = 'password123'): Promise<string> {
        const response = await this.request.post('/auth', {
            data: {
                username,
                password
            }
        });

        if (response.status() !== 200) {
            throw new Error(`Authentication failed with status: ${response.status()}`);
        }

        const responseBody: AuthResponse = await response.json();
        
        if (!responseBody.token) {
            throw new Error('Authentication response does not contain token');
        }

        return responseBody.token;
    }
}