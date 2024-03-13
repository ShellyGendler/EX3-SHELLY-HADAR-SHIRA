// Mocking the alert function
global.alert = jest.fn();

// Importing utils.js
const { InputValidation } = require('../SignUp/utils.js');

describe('InputValidation function', () => {
  test('should return false if any required field is empty', () => {
    expect(InputValidation('', 'Doe', 'john_doe', 'john@example.com', 'password', 'password', 'pic')).toBe(false);
    expect(alert).toHaveBeenCalledWith('All fields must be filled out');
  });

  test('should return false if password is less than 8 characters', () => {
    expect(InputValidation('John', 'Doe', 'john_doe', 'john@example.com', 'pass', 'pass', 'pic')).toBe(false);
    expect(alert).toHaveBeenCalledWith('password should contain at least 8 chars!');
  });

  // Add more test cases for other validation rules...
});
