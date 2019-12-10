const { isEmpty } = require('./custom');

describe('Test the custom validation functions', () => {
  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non empty objects', () => {
    expect(isEmpty({ name: 'non empty' })).toBe(false);
  });

  it('should return true for string with just spaces', () => {
    expect(isEmpty('  ')).toBe(true);
  });

  it('should return false for non empty string', () => {
    expect(isEmpty('non empty')).toBe(false);
  });
});
