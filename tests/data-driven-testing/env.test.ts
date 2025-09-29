import { test, expect } from '@playwright/test';
import data from '@test-data';

test('test data access', async () => {
    // console.log('Test Data:', data);
    expect(data.username).toBe('standard_user');
    expect(data.checkout.firstName).toBe('John');
});