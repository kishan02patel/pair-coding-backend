const validateLoginInput = require('./login');

describe('Test the user login input validation', () => {
  it('should return false for empty email', () => {
    const userInput = {
      password: 'not empty'
    };
    expect(validateLoginInput(userInput)).toHaveProperty('isValid', false);
    expect(validateLoginInput(userInput))
      .toHaveProperty('errors.email', 'Email field cannot be empty');
  });

  it('should return false for empty password', () => {
    const userInput = {
      email: 'not-empty@notempty.com'
    };
    expect(validateLoginInput(userInput)).toHaveProperty('isValid', false);
    expect(validateLoginInput(userInput))
      .toHaveProperty('errors.password', 'Password field cannot be empty');
  });

  it('should return false for invalid email', () => {
    const userInput = {
      email: 'not empty'
    };
    expect(validateLoginInput(userInput)).toHaveProperty('isValid', false);
    expect(validateLoginInput(userInput)).toHaveProperty('errors.email', 'Invalid email address');
  });

  it('should return true for valid email and non empty password', () => {
    const userInput = {
      email: 'not-empty@gmail.com',
      password: 'not empty'
    };
    expect(validateLoginInput(userInput)).toHaveProperty('isValid', true);
    expect(validateLoginInput(userInput).errors).not.toHaveProperty('errors');
  });
});
