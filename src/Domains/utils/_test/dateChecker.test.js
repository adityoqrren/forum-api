const isValidDate = require('../DateChecker');

describe('DateChecker', () => {
  describe('isValidDate function', () => {
    it('should return true for a valid Date object', () => {
      const date = new Date('2025-11-01T02:00:00Z');
      expect(isValidDate(date)).toBe(true);
    });

    it('should return false for an invalid Date object', () => {
      const invalidDate = new Date('invalid-date');
      expect(isValidDate(invalidDate)).toBe(false);
    });

    it('should return false for non-Date types (string)', () => {
      const value = '2025-11-01';
      expect(isValidDate(value)).toBe(false);
    });

    it('should return false for non-Date types (number)', () => {
      const value = Date.now();
      expect(isValidDate(value)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidDate(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false);
    });

    it('should return false for an empty object', () => {
      expect(isValidDate({})).toBe(false);
    });
  });
});
