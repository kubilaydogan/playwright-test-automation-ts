import { test, expect } from '@playwright/test';
import { BookingData, BookingResponse } from '@types';
import { AuthHelper } from '@utils';

test.describe('Native @API Tests using Playwright for RESTful Booker', () => {
    let createdBookingId: number;
    let authToken: string;
    let authHelper: AuthHelper;

    test.beforeAll(async ({ request }) => {
        authHelper = new AuthHelper(request);
        authToken = await authHelper.getAuthToken();
    });

    test('GET /booking', async ({ request }) => {
        const response = await request.get('/booking');
        const responseBody = await response.json();
        console.log('GET /booking response:', responseBody);

        expect(response.status()).toBe(200);
        expect(JSON.stringify(responseBody)).toContain('bookingid');
    });

    test('POST /booking', async ({ request }) => {
        const bookingData: BookingData = {
            firstname: 'John',
            lastname: 'Doe',
            totalprice: 300,
            depositpaid: true,
            bookingdates: {
                checkin: '2025-10-01',
                checkout: '2025-10-05'
            },
            additionalneeds: 'Breakfast'
        };

        const response = await request.post('/booking', {
            data: bookingData
        });
        const responseBody: BookingResponse = await response.json();      
        createdBookingId = responseBody.bookingid;
        
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('bookingid');
        expect(responseBody.booking).toHaveProperty('firstname', 'John');
    });

    test('PUT /booking/{id}', async ({ request }) => {
        // Use the booking ID from the previous test
        expect(createdBookingId).toBeDefined();
        expect(authToken).toBeDefined();
        console.log('Using booking ID:', createdBookingId);
        console.log('Using auth token:', authToken ? 'Token available' : 'No token');
        
        const response = await request.put(`/booking/${createdBookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${authToken}`
            },
            data: {
                firstname: 'Jane',
                lastname: 'Doe',
                totalprice: 456,
                depositpaid: false,
                bookingdates: {
                    checkin: '2025-10-01',
                    checkout: '2025-10-05'
                },
                additionalneeds: 'Dinner'
            }
        });
        
        const responseBody = await response.json();      
        expect(responseBody).toHaveProperty('firstname', 'Jane');
        expect(response.status()).toBe(200);
    });
});