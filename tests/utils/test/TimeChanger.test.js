const { addTimeByMinutes, minTimeByMinutes } = require('../TimeChanger');

describe('TimeChanger functions test', () => {
  beforeAll(() => {
    jest.useFakeTimers(); // activate fake timer
    jest.setSystemTime(new Date('2025-01-01T10:30:00Z')); // time lock
  });

  afterAll(() => {
    jest.useRealTimers(); // restore to real timer
  });

  it('should add minutes correctly', () => {
    const result = addTimeByMinutes(20);
    expect(result.toISOString()).toBe('2025-01-01T10:50:00.000Z');
  });

  it('should subtract minutes correctly', () => {
    const result = minTimeByMinutes(15);
    expect(result.toISOString()).toBe('2025-01-01T10:15:00.000Z');
  });

  it('should handle minute overflow when adding (e.g : +90 mins)', () => {
    const result = addTimeByMinutes(90);
    expect(result.toISOString()).toBe('2025-01-01T12:00:00.000Z');
  });

  it('should handle minute underflow when subtracting (e.g : -40 mins)', () => {
    const result = minTimeByMinutes(40);
    expect(result.toISOString()).toBe('2025-01-01T09:50:00.000Z');
  });
});
