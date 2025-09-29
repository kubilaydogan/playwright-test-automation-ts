import { test, expect } from '@playwright/test';
import { loadCSV } from '@utils';

const employeeTestData = loadCSV('test-data/csv/employees.csv');

test.describe.serial('Data-Driven Testing with @DDT @csv', () => {

    // Data-driven test using CSV data
    employeeTestData.forEach((employee) => {
        test(`reading test data from csv file - ${employee.testCase}`, async ({ }) => {
            
            // Validate CSV data structure
            expect(employee.firstName).toBeTruthy();
            expect(employee.ssn).toMatch(/^\d{3}-\d{2}-\d{4}$/);
            expect(employee.dateOfBirth).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
            expect(employee.zipCode).toMatch(/^\d{5}$/);
            expect(employee.gender).toMatch(/^[MF]$/);

            console.log(`✅ All validations passed for: ${employee.firstName} ${employee.lastName}`);
        });
    });
})