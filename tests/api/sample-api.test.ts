import { test, expect } from '@playwright/test';

test.describe('Native @API Tests using Playwright for RESTful Booker', () => {
    let createdBookingId: number;
    let authToken: string;

    test('POST /auth - Get authentication token', async ({ request }) => {
        const response = await request.post('/auth', {
            data: {
                username: 'admin',
                password: 'password123'
            }
        });
        const responseBody = await response.json();
        authToken = responseBody.token;
        
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('token');
    });

    test('GET /booking', async ({ request }) => {
        const response = await request.get('/booking');
        const responseBody = await response.json();
        console.log('GET /booking response:', responseBody);

        expect(response.status()).toBe(200);
        expect(JSON.stringify(responseBody)).toContain('bookingid');
    });

    test('POST /booking', async ({ request }) => {
        const response = await request.post('/booking', {
            data: {
                firstname: 'John',
                lastname: 'Doe',
                totalprice: 123,
                depositpaid: true,
                bookingdates: {
                    checkin: '2023-01-01',
                    checkout: '2023-01-02'
                },
                additionalneeds: 'Breakfast'
            }
        });
        const responseBody = await response.json();      
        createdBookingId = responseBody.bookingid;
        console.log('Created booking ID:', createdBookingId);
        
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('bookingid');
        expect(responseBody.booking).toHaveProperty('firstname', 'John');
    });

    test('PUT /booking/{id}', async ({ request }) => {
        // Use the booking ID from the previous test
        expect(createdBookingId).toBeDefined();
        expect(authToken).toBeDefined();
        console.log('Using booking ID:', createdBookingId);
        
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
                    checkin: '2023-02-01',
                    checkout: '2023-02-02'
                },
                additionalneeds: 'Dinner'
            }
        });
        
        const responseBody = await response.json();      
        expect(responseBody).toHaveProperty('firstname', 'Jane');
        expect(response.status()).toBe(200);
    });

});