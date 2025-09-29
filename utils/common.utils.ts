
/**
 * Date and time utilities for tests
 */

export class DateUtils {
  /**
   * Get current date in YYYY-MM-DD format
   */
  static getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp() {
    return Date.now();
  }

  /**
   * Format date to specific format
   * @param date - Date object
   * @param format - Format string (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY')
   */
  static formatDate(date: Date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Add days to current date
   * @param days - Number of days to add (can be negative)
   */
  static addDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   * Get date range for testing
   * @param startDaysFromNow - Days from now for start date
   * @param endDaysFromNow - Days from now for end date
   */
  static getDateRange(startDaysFromNow: number, endDaysFromNow: number): {
    startDate: string;
    endDate: string;
  } {
    return {
      startDate: this.formatDate(this.addDays(startDaysFromNow)),
      endDate: this.formatDate(this.addDays(endDaysFromNow))
    };
  }
}

/**
 * String utilities for tests
 */
export class StringUtils {
  /**
   * Generate random string of specified length
   * @param length - Length of random string
   * @param includeNumbers - Whether to include numbers
   */
  static generateRandomString(length = 10, includeNumbers = true) {
    const chars = includeNumbers 
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email address
   * @param domain - Email domain (default: 'test.com')
   */
  static generateRandomEmail(domain = 'test.com') {
    const username = this.generateRandomString(8, true).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Generate random phone number
   * @param format - Phone format (default: 'XXX-XXX-XXXX')
   */
  static generateRandomPhone(format = 'XXX-XXX-XXXX') {
    return format.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
  }

  /**
   * Capitalize first letter of each word
   * @param text - Text to capitalize
   */
  static capitalizeWords(text: string) {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Remove special characters from string
   * @param text - Text to clean
   * @param keepSpaces - Whether to keep spaces
   */
  static removeSpecialCharacters(text: string, keepSpaces = true) {
    const pattern = keepSpaces ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z0-9]/g;
    return text.replace(pattern, '');
  }
}

/**
 * Number utilities for tests
 */
export class NumberUtils {
  /**
   * Generate random number between min and max
   * @param min - Minimum value
   * @param max - Maximum value
   */
  static randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random decimal number
   * @param min - Minimum value
   * @param max - Maximum value
   * @param decimals - Number of decimal places
   */
  static randomDecimal(min: number, max: number, decimals = 2) {
    const random = Math.random() * (max - min) + min;
    return Number(random.toFixed(decimals));
  }

  /**
   * Format number as currency
   * @param amount - Amount to format
   * @param currency - Currency code (default: 'USD')
   */
  static formatAsCurrency(amount: number, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
