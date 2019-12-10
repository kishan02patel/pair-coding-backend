const validateRegisterInput = require('./register');

describe('Test the user login input validation', () => {
  it('should return false for empty name', () => {
    const userInput = {
      email: 'not empty',
      password: 'not empty'
    };
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.name', 'Name field cannot be empty');
  });

  it('should return false for invalid name length', () => {
    const userInput = {
      email: 'not empty',
      password: 'not empty',
      name: 'a'
    };
    const longName = 'asdjhsfbsjdbgfdhjbgdfbvdfjblrughlskrdjvndkjrvd';
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.name', 'Name must be between 2 and 30 characters');
    expect(validateRegisterInput({ ...userInput, name: longName }))
      .toHaveProperty('isValid', false);
    expect(validateRegisterInput({ ...userInput, name: longName }))
      .toHaveProperty('errors.name', 'Name must be between 2 and 30 characters');
  });

  it('should return false for empty email', () => {
    const userInput = {
      password: 'not empty'
    };
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.email', 'Email field cannot be empty');
  });

  it('should return false for invalid email', () => {
    const userInput = {
      email: 'not empty'
    };
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.email', 'Invalid email address');
  });

  it('should return false for empty password', () => {
    const userInput = {
      email: 'not-empty@notempty.com'
    };
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.password', 'Password field cannot be empty');
  });

  it('should return false for invalid password length', () => {
    const userInput = {
      email: 'not-empty@notempty.com',
      password: 'short'
    };
    const longPassword = 'asdjhsfbsjdbgfdhjbgdfbvdfjblrughlskrdjvnd';
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.password', 'Password should be between 8 and 30 characters');
    expect(validateRegisterInput({ ...userInput, password: longPassword }))
      .toHaveProperty('isValid', false);
    expect(validateRegisterInput(userInput))
      .toHaveProperty('errors.password', 'Password should be between 8 and 30 characters');
  });

  it('should return true for valid name, email and password', () => {
    const userInput = {
      name: 'valid',
      email: 'not-empty@gmail.com',
      password: 'not empty'
    };
    expect(validateRegisterInput(userInput)).toHaveProperty('isValid', true);
    expect(validateRegisterInput(userInput).errors).not.toHaveProperty('errors');
  });
});
