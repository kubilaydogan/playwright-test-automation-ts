import { test, expect } from '@playwright/test';
import { loadJSON } from '@utils';

const data = loadJSON('test-data/json/test-data.json');

// Ensure the data is loaded correctly
test.describe.serial('Data-Driven Testing Options @DDT @json', () => {

    test('excluded test from multiple runs', async ({ }) => {
        console.log('This test should run only once');
        expect(true).toBeTruthy();
    });

    // Data-driven test using JSON data
    data.forEach((data, index: number) => {
        test(`reading test data from json file - ${data.testCase}`, async ({ }) => {

            console.log(`Running test case ${index + 1}: ${data.employee.firstName} ${data.employee.lastName}`);
            expect(data.employee.firstName).not.toBeNull();

        });
    });

});


// serial tests run sequentially, useful for tests that depend on each other 
// in this case, it is for demo purposes only