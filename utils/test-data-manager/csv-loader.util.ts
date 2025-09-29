import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Load CSV data synchronously
 * @param filePath - Path to the CSV file (relative to project root)
 * @returns Array of objects with CSV data
 */
export function loadCSV(filePath: string): any[] {
    // Resolve path relative to project root
    const resolvedPath = path.resolve(process.cwd(), filePath);
    const csvData = fs.readFileSync(resolvedPath, 'utf8');
    return parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
}