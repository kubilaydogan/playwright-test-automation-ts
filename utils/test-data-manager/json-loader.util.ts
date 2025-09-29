import fs from 'fs';
import path from 'path';

/**
 * @param filePath - Path to the JSON file (relative to project root or absolute)
 * @returns Array of objects or single object with JSON data
 */

export function loadJSON(filePath: string): any[] {
    // Resolve path relative to project root
    const resolvedPath = path.resolve(process.cwd(), filePath);
    const jsonData = fs.readFileSync(resolvedPath, 'utf8');
    return JSON.parse(jsonData);
}